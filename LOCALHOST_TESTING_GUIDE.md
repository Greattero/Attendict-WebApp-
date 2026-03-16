# Localhost Testing Guide - Token Authentication

## Critical Fixes Applied

### 1. ✅ CORS Configuration (server/server.js, line 30)

**FIXED**: Added 'Authorization' to allowedHeaders

```javascript
allowedHeaders: ['Content-Type', 'Authorization'],
```

**Why**: Authorization header was being rejected by CORS, preventing token-authenticated requests

### 2. ✅ Token Validation Middleware (server/server.js, lines 133-203)

**FIXED**: Implemented actual token validation instead of dummy pass-through

- Checks Authorization header exists
- Validates token exists in MongoDB
- Checks token expiry
- Updates last activity time
- Returns 401 if token invalid/expired

### 3. ✅ MongoDB Connection (server/.env, line 2)

**FIXED**: Added missing protocol to connection string

```env
MONGODB_URI="mongodb://localhost:27017/AttendanceDB"
```

### 4. ✅ API Client Base URL (src/apiClient.js, line 6)

**FIXED**: Switched to localhost for development

```javascript
const API_BASE_URL = "http://localhost:5000";
```

---

## Prerequisites

### 1. MongoDB Running Locally

```bash
# Ensure MongoDB service is running
# Windows: MongoDB should be in Services
# macOS: brew services start mongodb-community
# Linux: systemctl start mongod
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../
npm install
```

---

## Testing Steps

### Step 1: Start Backend Server

```bash
cd server
npm start
```

**Expected Output:**

```
Server is running on port 5000
Mongoose connected successfully...
```

### Step 2: Start Frontend Server

```bash
# In new terminal, from project root
npm run dev
```

**Expected Output:**

```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173
```

### Step 3: Test Login Flow

1. Open browser at `http://localhost:5173`
2. Enter test credentials:
   - Index Number: `TEST001`
   - Password: `TEST001`
   - Select: "Class member" or "Course rep"
3. Click Login

**Expected Outcome:**

- ✅ Login success, redirected to main app
- ✅ Token stored in localStorage
- ✅ No alert about missing token

### Step 4: Verify Token Storage

Open DevTools → Application → Local Storage → localhost:5173

- Should see: `authToken` (32-char hex string)
- Should see: `personType` (rep or member)

### Step 5: Verify Network Headers

Open DevTools → Network Tab:

1. Perform any API action (check-in, create session, etc.)
2. Click the request to view details
3. Go to Headers tab → Request Headers
4. Should see: `Authorization: Bearer xxxxxxxx...`

### Step 6: Test Concurrent Login Prevention

1. Login as User A in Chrome
2. Open new browser window (Safari/Firefox)
3. Try to login as User B on same device
4. **Expected**: Should get error "Another user is already logged in on this device"

### Step 7: Test Token Expiry

1. Login successfully
2. Copy the token from localStorage
3. Wait and monitor token expiry (set to 10 minutes in code)
4. Try to make an API request after expiry
5. **Expected**: Get 401 "Token has expired. Please login again."

---

## Troubleshooting

### Problem: CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Check server.js corsOptions includes 'Authorization' in allowedHeaders

### Problem: MongoDB Connection Error

```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**:

- Ensure MongoDB is running locally
- Check .env has `mongodb://localhost:27017/...`
- Try: `mongosh` to test connection

### Problem: Token Not Stored

**Check in console**:

1. Does login return success?
2. Does response include `token` field?
3. Open console → check for "Login response:" logs

### Problem: API Calls Return 401

**Causes**:

- Token expired → user needs to login again
- Token not in Authorization header → check apiClient
- Token invalid → check MongoDB sessions collection
- CORS blocking Authorization header → check corsOptions

---

## Testing Checklist

- [ ] MongoDB running locally
- [ ] Backend starts without errors on port 5000
- [ ] Frontend starts without errors on port 5173
- [ ] Can login with valid credentials
- [ ] Token generated and stored in localStorage
- [ ] Authorization header present in API requests
- [ ] Can perform check-in/other API actions successfully
- [ ] Concurrent login from different user blocked
- [ ] Token expiry works after 10 minutes
- [ ] Can logout successfully
- [ ] After logout, API calls return 401

---

## Next Steps After Testing

1. **All tests pass?** → Ready to deploy to production
   - Update API_BASE_URL in apiClient.js to production URL
   - Deploy to Render (backend) and Vercel (frontend)

2. **Tests failing?** → Debug using console logs and MongoDB
   - Check server terminal for error logs
   - Check browser console for frontend errors
   - Query sessions collection: `db.sessions.find({})`

---

## Key Endpoints

### Public Endpoints (No Token Required)

- `POST /api/login-details` - Login
- `GET /api/host-location?programme=...` - Get session location

### Protected Endpoints (Token Required)

- `POST /api/host-details` - Create session
- `POST /api/checkin-details` - Check in
- `GET /api/student-list?programme=...` - Get students
- `DELETE /api/delete-collection` - Delete records
- `POST /api/logout` - Logout

---

## Database Queries

### Check Active Sessions

```javascript
// In mongosh
db.sessions.find({ active: true });
```

### Check Specific User Sessions

```javascript
db.sessions.find({ username: "TEST001" });
```

### Clear All Sessions (for testing)

```javascript
db.sessions.deleteMany({});
```

---

**Last Updated**: 2026-03-15
**Status**: Ready for Localhost Testing
