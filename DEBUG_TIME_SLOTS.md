# Debug: Time Slots Not Appearing After Deployment

## Quick Check Steps

### Step 1: Check Browser Console
1. Open your deployed site
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for messages starting with `[fetchSlots]` or `[API Config]`

**What to look for:**
- `[API Config] API_BASE_URL: undefined` → Environment variable not set
- `[fetchSlots] Network error` → API URL is incorrect
- `[fetchSlots] API Response Data: { slots: [] }` → API working but no slots returned

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Filter by "availability"
3. Click on the request to `/api/doctors/.../availability/...`
4. Check:
   - **Status Code**: Should be 200 (not 404 or 500)
   - **Request URL**: Should match your backend URL
   - **Response**: Should contain `{ slots: [...] }`

### Step 3: Verify Environment Variable

**For Vercel:**
1. Go to your project → Settings → Environment Variables
2. Check if `VITE_SERVER_URL` is set
3. Value should be your backend URL (e.g., `https://api.yourdomain.com`)
4. **Important**: After adding/changing env vars, you MUST redeploy

**For Netlify:**
1. Go to Site settings → Environment variables
2. Check if `VITE_SERVER_URL` is set
3. Redeploy after changes

**For Other Platforms:**
- Check your platform's documentation for setting environment variables
- Make sure the variable name is exactly `VITE_SERVER_URL`

### Step 4: Test API Directly

Open this URL in your browser (replace with your values):
```
https://your-backend-url.com/api/doctors/{doctorId}/availability/2026-01-23
```

**Expected Response:**
```json
{
  "doctorId": "...",
  "date": "2026-01-23",
  "slots": [
    { "start": "06:00", "end": "06:30" },
    { "start": "06:30", "end": "07:00" },
    ...
  ]
}
```

If you get an error or empty slots, the issue is on the backend.

## Common Issues

### Issue 1: `API_BASE_URL` is `undefined`
**Solution:**
- Set `VITE_SERVER_URL` environment variable in your deployment platform
- Rebuild and redeploy the frontend

### Issue 2: Network Error / CORS Error
**Solution:**
- Check CORS settings in `server/server.js`
- Ensure your frontend URL is whitelisted
- Verify `VITE_SERVER_URL` matches your backend URL exactly

### Issue 3: 404 Not Found
**Solution:**
- Verify the route exists: `/api/doctors/:doctorId/availability/:date`
- Check that routes are registered in `server/server.js`

### Issue 4: Empty slots array `[]`
**Solution:**
- Check server logs for `[getSlots]` messages
- Verify doctor has availability set in database
- Check date format is YYYY-MM-DD

## Quick Fix Checklist

- [ ] `VITE_SERVER_URL` is set in deployment platform
- [ ] Frontend has been rebuilt and redeployed after setting env var
- [ ] Backend is running and accessible
- [ ] API endpoint returns slots when tested directly
- [ ] Browser console shows `[fetchSlots]` logs
- [ ] Network tab shows successful API request (status 200)

## Still Not Working?

Share these details:
1. Browser console logs (especially `[fetchSlots]` messages)
2. Network tab screenshot showing the API request
3. The value of `VITE_SERVER_URL` (without sensitive parts)
4. Backend server logs

