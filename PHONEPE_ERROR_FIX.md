# PhonePe "KEY_NOT_CONFIGURED" Error - Fix Guide

## The Error
```
"KEY_NOT_CONFIGURED": "Key not found for the merchant"
```

This means **PhonePe's API doesn't recognize your credentials**.

---

## Why This Happens

Your credentials (`M237CPS6EHSOU` and the Salt Key) might be:
1. **Not activated yet** on PhonePe's test environment
2. **Wrong environment** - Using production keys in sandbox or vice versa
3. **Expired or revoked** test credentials
4. **Not fully set up** in PhonePe developer portal

---

## Quick Fix Options

### Option 1: Use PhonePe Sandbox Test Credentials (Recommended)

PhonePe provides public test credentials for sandbox testing:

**Update your `.env.local`:**

```env
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_API_ENDPOINT=https://api-preprod.phonepe.com/apis/hermes
```

These are PhonePe's official test credentials that always work.

---

### Option 2: Verify Your PhonePe Account

1. **Login to PhonePe Business Dashboard**
   - Go to: https://business.phonepe.com/

2. **Navigate to Developer Section**
   - API Keys → Sandbox Environment

3. **Check if your Merchant ID is activated**
   - Status should be "Active"
   - Copy the **exact** Merchant ID and Salt Key

4. **Make sure you're using SANDBOX keys**
   - NOT production keys
   - The endpoint should be `api-preprod.phonepe.com`

---

### Option 3: Create a New Test Account

If your account isn't working:

1. Go to https://developer.phonepe.com/
2. Sign up for a new developer account
3. Request sandbox access
4. Get your test credentials
5. Update `.env.local` with the new credentials

---

## After Updating Credentials

1. **Save `.env.local`**
2. **Restart the dev server:**
   ```bash
   # Press Ctrl+C in terminal
   npm run dev
   ```
3. **Hard refresh browser:** `Cmd + Shift + R`
4. **Try booking again**

---

## Test with PhonePe's Default Sandbox Creds (Fastest)

Copy-paste this into your `.env.local` RIGHT NOW:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://axlxihwwdtencrftjuwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bHhpaHd3ZHRlbmNyZnRqdXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MzU4NTYsImV4cCI6MjA4MTExMTg1Nn0.Z4HUZNxrG4fWLfzFjIHCiDjA7uaN5kOEKrqDzMAm-Ek

# PhonePe Payment Gateway (PhonePe Official Test Credentials)
NEXT_PUBLIC_PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_API_ENDPOINT=https://api-preprod.phonepe.com/apis/hermes

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then restart your server and test immediately!

---

## Need More Help?

- PhonePe Sandbox Docs: https://developer.phonepe.com/v1/docs/sandbox-details
- PhonePe Support: support@phonepe.com
