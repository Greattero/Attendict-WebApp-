# Login Token Debug Checklist

## ✅ Fixed: Login.jsx Now Uses apiClient

Login.jsx now:

- Imports `{ apiPost }` from apiClient
- Uses `await apiPost("/api/login-details", {...})` instead of hardcoded fetch
- Automatically points to `http://localhost:5000` (via apiClient)

---

## 🔍 Debug Steps (Do These In Order)

### Step 1: Clear Caches & Restart Everything

```bash
# 1. Stop both servers (Ctrl+C in both terminals)

# 2. Clear npm caches
cd server && npm cache clean --force
cd ../
npm cache clean --force

# 3. Clear browser cache
# Press Ctrl+Shift+Delete → Clear All Time → Clear Data

# 4. Restart backend
cd server
npm start
# Should see:
# - "Server is running on port 5000"
# - "Mongoose connected successfully..."

# 5. In new terminal, restart frontend
npm run dev
# Should see:
# - "VITE ... ready in ... ms"
# - "Local: http://localhost:5173"
```

### Step 2: Test Login with Console Open

1. Open http://localhost:5173 in browser
2. **Open DevTools (F12) → Console tab**
3. Enter credentials:
   - Index Number: `TEST001`
   - Password: `TEST001`
   - Select: "Class member"
4. Click Login button
5. **Look at console** - you should see logs like:
   ```
   Login response: {success: true, token: "abc123...", message: "Login successful"}
   Login successful, token saved: abc123...
   ```

### Step 3: Check What Console Shows

**Tell me what appears in the console:**

- ✅ `Login response: {...}` - Backend responded
- ❌ CORS error - Check backend corsOptions
- ❌ Network error - Backend not running
- ❌ Token is undefined - Backend not returning token

### Step 4: Check Network Tab

1. Open DevTools → Network tab
2. Try login again
3. Look for `login-details` request
4. Click on it → Response tab
5. **Show me what you see in the Response**

---

## 🎯 Check Database Credentials

Since you're using production MongoDB, the user TEST001 must exist in the database.

**Option A: Check if user exists**

```
// Use MongoDB Compass or mongosh
db.students.findOne({username: "TEST001"})
```

**Option B: Use real test credentials**

- Use your actual student credentials instead of TEST001
- Example: Your real index number and password

---

## 🔧 Common Issues & Fixes

### Issue: Network Error or CORS Error

**Fix**: Backend not running

```bash
cd server && npm start
# Check for error messages in terminal
```

### Issue: Wrong URL in Response

**Fix**: Make sure apiClient.js line 6 is `http://localhost:5000`

```bash
# Verify
grep "API_BASE_URL" src/apiClient.js
# Should show: const API_BASE_URL = "http://localhost:5000";
```

### Issue: "Invalid username or password"

**Fix**: Credentials don't match database

- Check if TEST001 exists in production database
- Or use your real credentials
- Check that username/password are uppercase (Login.jsx converts them)

### Issue: "Backend returned success but no token"

**Fix**: Login endpoint not returning token field

```bash
# Check server logs for errors
# Look for "Session token generated: YES" or "NO"
# If "NO", token generation is failing
```

---

## 📋 Quick Status Check

Run these commands to verify everything is set up:

```bash
# Check if backend is listening on 5000
# (while server is running)
curl http://localhost:5000/api/login-details -X OPTIONS
# Should NOT error

# Check if frontend points to localhost
grep "API_BASE_URL" src/apiClient.js

# Check if Login.jsx uses apiClient
grep "import.*apiClient\|apiPost" src/Login.jsx

# Check CORS config has Authorization
grep "allowedHeaders" server/server.js
# Should show: 'Content-Type', 'Authorization'
```

---

## 🚨 Next Action

**Please do:**

1. Restart both servers (backend & frontend)
2. Try login with TEST001 / TEST001 (or your real credentials)
3. Open DevTools Console
4. **Tell me exactly what console shows** (error messages, logs, etc.)
5. **Tell me what the Network tab Response contains**

Once you tell me what you see, I can pinpoint the exact issue! 🎯
