# ATTENDICT Security Vulnerability & Proposed Fix

**Date:** March 10, 2025
**Status:** Critical Security Issue Identified
**Priority:** High

---

## Problem Statement

### The Vulnerability: Proxy Attendance via Multiple Browser Sessions

**Current Issue:**
The system stores user credentials in browser localStorage without server-side session management. This creates a critical vulnerability where one person can fraudulently check in for multiple students using different browsers on the same device.

### Attack Scenario

```
Attacker: Student A (has physical access to a laptop)

Step 1:
- Open Chrome browser
- Log in as Student A (their real account)
- Credentials stored in localStorage: username = "SRI41001", password = "xxxx"

Step 2:
- Open Safari browser (same device, different browser)
- Log in as Student B (a friend's account)
- Credentials stored in localStorage: username = "SRI41002", password = "xxxx"

Step 3:
- During CE100 lecture, Student A enables GPS on the device
- Chrome: Check in Student A ✓ (legitimate)
- Safari: Check in Student B ✓ (fraudulent - Student B not present)

Why This Works Currently:
- System only verifies GPS location at check-in moment
- Both credentials are stored locally, accessible to same device
- No server-side validation of WHO is doing the check-in
- No way to distinguish legitimate multi-user scenarios from fraud

Result:
- Two students marked present from same location
- Student B gets unearned attendance without being in class
- Attendance record is fraudulent
```

### Current System Weakness

**Root Cause:** localStorage stores credentials + no session token system

- Credentials are plaintext in browser storage
- Any browser tab/window on same device can access them
- Server doesn't track which device/session is active
- No correlation between login and check-in activity

**Impact:**

- High risk of proxy attendance fraud
- Lecturer cannot detect fraudulent check-ins
- Attendance records become unreliable

---

## Proposed Solution: Server-Side Session Tokens

### How It Works

Replace localStorage credential storage with a token-based session system.

```
CURRENT (VULNERABLE):
┌─────────────┐
│ Browser 1   │  localStorage: username="SRI41001", password="xxxx"
└─────────────┘
       ↕
    API Call
       ↕
┌─────────────────────┐
│  Server Validates   │  No session tracking
│  User credentials   │  Anyone with credentials can use them
└─────────────────────┘

PROPOSED (SECURE):
┌──────────────────────┐
│ Chrome Login         │
│ User: SRI41001       │  Token: "abc123xyz"
│ Password: [sent]     │  (stored securely)
└──────────────────────┘
       ↕
    API Call with Token
       ↕
┌─────────────────────────────┐
│  Server Session Store       │
│  Token: "abc123xyz"         │
│  User: SRI41001             │
│  Device: Chrome/Windows/IP  │
│  Active: YES                │
└─────────────────────────────┘

┌──────────────────────┐
│ Safari Login         │
│ User: SRI41002       │
│ Password: [sent]     │
└──────────────────────┘
       ↕
    API Call with Token
       ↕
┌─────────────────────────────┐
│  Server Session Store       │
│  Token: "def456uvw"         │  ← DIFFERENT TOKEN
│  User: SRI41002             │  ← DIFFERENT USER
│  Device: Safari/Windows/IP  │  ← SAME DEVICE, NEW SESSION
│  Active: YES                │
└─────────────────────────────┘

Result:
- Each login gets unique token
- Server tracks both sessions separately
- If Safari tries to use Chrome's token → REJECTED
- If Chrome tries to check in as SRI41002 → REJECTED (wrong token)
```

### Key Changes

#### 1. Backend (server.js)

**New Database Collection: `sessions`**

```javascript
{
  _id: ObjectId,
  token: "abc123xyz...",           // Unique session token
  username: "SRI41001",            // Who owns this token
  deviceFingerprint: "device_hash", // Browser/OS/Device combo
  loginTime: 2025-03-10T14:30:00,
  expiryTime: 2025-03-10T14:40:00, // Token expires in 10 minutes
  active: true,
  ipAddress: "192.168.1.100",
  lastActivity: 2025-03-10T14:35:00
}
```

**Modified Login Endpoint: `/api/login-details`**

```javascript
OLD:
- Validate username/password
- Return: {role: "Student"}
- Frontend stores in localStorage

NEW:
- Validate username/password
- Create unique session token (generate random string)
- Store session in database
- Return token (not credentials)
- Frontend stores token only (not username/password)
```

**All API Endpoints Updated**

```javascript
OLD:
GET /api/student-list
  - No authentication check
  - Uses credentials from localStorage

NEW:
GET /api/student-list
  Headers: {Authorization: "Bearer abc123xyz..."}
  - Server validates token exists and is active
  - Server verifies token belongs to logged-in user
  - Request rejected if token invalid/expired
```

#### 2. Frontend (React Components)

**Replace localStorage Usage**

```javascript
OLD (Login.jsx):
localStorage.setItem('username', username);
localStorage.setItem('password', password);

NEW (Login.jsx):
const response = await fetch('/api/login-details', {
  method: 'POST',
  body: JSON.stringify({username, password})
});
const {token} = await response.json();
localStorage.setItem('authToken', token);  // Store token only, not credentials
```

**Update API Calls**

```javascript
OLD (CheckInForm.jsx):
fetch('/api/checkin-details', {
  method: 'POST',
  body: JSON.stringify({...}),  // No auth header
})

NEW (CheckInForm.jsx):
const token = localStorage.getItem('authToken');
fetch('/api/checkin-details', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`  // Include token
  },
  body: JSON.stringify({...})
})
```

### Why This Fixes the Problem

```
Attack Scenario with New System:

Step 1: Chrome logs in
- Sends username: SRI41001, password: xxxx
- Server creates TOKEN-ABC for SRI41001
- Server response: {token: "TOKEN-ABC"}
- Chrome stores: localStorage.authToken = "TOKEN-ABC"

Step 2: Safari logs in (same device)
- Sends username: SRI41002, password: xxxx
- Server creates TOKEN-DEF for SRI41002
- Server response: {token: "TOKEN-DEF"}
- Safari stores: localStorage.authToken = "TOKEN-DEF"

Step 3: Chrome tries to check in Student A
- Sends: {name: "Student A", ...} + Header: Authorization: "Bearer TOKEN-ABC"
- Server validates: TOKEN-ABC → SRI41001 ✓
- Allows check-in ✓

Step 4: Safari tries to check in Student B
- Sends: {name: "Student B", ...} + Header: Authorization: "Bearer TOKEN-DEF"
- Server validates: TOKEN-DEF → SRI41002 ✓
- Allows check-in ✓

Step 5: Chrome tries to check in Student B (spoofing with Student A's token)
- Sends: {name: "Student B", ...} + Header: Authorization: "Bearer TOKEN-ABC"
- Server validates: TOKEN-ABC → SRI41001 (not SRI41002)
- REJECTED ✗ (token doesn't match requested user)

RESULT: Fraud prevented at server level
```

---

## Implementation Plan

### Phase 1: Core Token System (Backend)

1. Create `sessions` MongoDB collection schema
2. Modify `/api/login-details` to generate and store tokens
3. Create middleware to validate tokens on all endpoints
4. Set token expiry (10 minutes matches session duration)
5. Add logout endpoint to invalidate token

**Estimated Time:** 4-6 hours

### Phase 2: Frontend Updates

1. Update Login.jsx to store token instead of credentials
2. Update all API calls to include Authorization header
3. Clear token on logout
4. Handle token expiry (redirect to login)

**Estimated Time:** 2-3 hours

### Phase 3: Testing & Deployment

1. Test login flow
2. Test check-in with tokens
3. Test token expiry
4. Deploy to production (Render backend)
5. Deploy frontend to Vercel

**Estimated Time:** 2 hours

**Total: ~8-11 hours of development**

---

## Security Improvements Provided

### ✓ Prevents Multi-Browser Proxy Fraud

- Each browser gets different token
- Check-in validates token matches user
- Impossible to check in for someone else using different token

### ✓ Eliminates LoginStorage Credential Exposure

- Passwords never stored in browser
- Only temporary tokens stored
- Tokens auto-expire in 10 minutes

### ✓ Session Tracking

- Server knows which user is active at any time
- Can implement concurrent login prevention (optional future feature)
- Better audit trail for debugging

### ✓ Backward Compatible

- Existing attendance system continues to work
- GPS verification still in place
- IP tracking still active

---

## Alternative Approaches Considered

| Approach                 | Pros                                                                   | Cons                                         | Why Not Chosen                 |
| ------------------------ | ---------------------------------------------------------------------- | -------------------------------------------- | ------------------------------ |
| **Tokens (Recommended)** | Fixes root cause, industry standard, scalable, enables future features | Medium implementation effort                 | ✓ Best overall solution        |
| Device Fingerprinting    | Catches same-device fraud                                              | Doesn't fix credential storage issue         | Secondary layer only           |
| Biometric Auth           | Very secure                                                            | Requires mobile app, not all devices support | Good future enhancement        |
| Lecturer Verification    | Human review layer                                                     | Manual, time-consuming                       | Good human backup, not primary |
| Session Storage          | Simpler than tokens                                                    | Still vulnerable if localStorage accessed    | Not sufficient                 |

---

## Risks & Mitigation

| Risk                           | Mitigation                                                             |
| ------------------------------ | ---------------------------------------------------------------------- |
| Token stolen from localStorage | Tokens auto-expire in 10 minutes; implement HttpOnly cookies in future |
| Implementation bugs            | Thorough testing before production deploy                              |
| User confusion                 | Session lasts whole lecture (10 min), auto-logout after inactivity     |
| Deployment issues              | Test in staging environment first                                      |

---

## Next Steps

1. **Review & Approval** - Friend reviews this document
2. **Approval** - Confirm approach aligns with project goals
3. **Implementation** - Start backend token system
4. **Testing** - Verify no regressions
5. **Deployment** - Push to production

---

## Questions for Discussion

1. Does this approach align with your security requirements?
2. Are you comfortable with the implementation timeline?
3. Should we implement additional security layers later (biometrics, device fingerprinting)?
4. Any concerns about user experience changes?

---

**Prepared by:** Claude Code Assistant
**Ready to proceed with implementation?** Yes / No / Need Discussion
