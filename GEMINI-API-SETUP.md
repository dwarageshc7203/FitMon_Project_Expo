# Gemini API Setup Guide

## 🔴 Current Error

```
[403 Forbidden] Method doesn't allow unregistered callers (callers without established identity). 
Please use API Key or other form of API consumer identity to call this API.
```

This means your Gemini API key is either:
- Invalid or expired
- Not properly activated
- Missing required permissions

---

## ✅ Solution Steps

### Step 1: Get a New API Key

1. **Go to Google AI Studio:**
   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**

3. **Create API Key:**
   - Click "Create API Key" or "Get API Key"
   - If prompted, select or create a Google Cloud project
   - Copy the generated API key (starts with `AIza...`)

4. **Enable Gemini API (if prompted):**
   - You may need to enable the "Generative Language API" in Google Cloud Console
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable" if not already enabled

### Step 2: Update Your .env File

1. **Open `backend/.env` file**

2. **Update or add the API key:**
   ```env
   GEMINI_API_KEY=AIzaSyYourNewApiKeyHere
   ```
   Replace `AIzaSyYourNewApiKeyHere` with your actual API key from Step 1.

3. **Save the file**

### Step 3: Restart the Backend Server

1. **Stop the current server:**
   - Press `Ctrl+C` in the terminal where the server is running

2. **Rebuild (if needed):**
   ```bash
   cd backend
   npm run build
   ```

3. **Start the server again:**
   ```bash
   npm run start:dev
   ```

### Step 4: Verify It Works

Try generating a session report again. You should see:
- ✅ Success message in logs
- No 403 errors
- Report generated successfully

---

## 🔍 Troubleshooting

### Still Getting 403 Error?

1. **Verify API key format:**
   - Should start with `AIza`
   - Should be about 39 characters long
   - No spaces or extra characters

2. **Check API key is active:**
   - Go back to https://makersuite.google.com/app/apikey
   - Verify the key is listed and active
   - If it says "Restricted" or has warnings, click to fix them

3. **Enable Generative Language API:**
   - Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Ensure it's enabled for your project

4. **Check quota/limits:**
   - Free tier has usage limits
   - If exceeded, wait or upgrade

### API Key Not Found Error?

1. **Verify .env file location:**
   - Must be in `backend/.env` (not root directory)
   - Check the file exists: `backend/.env`

2. **Check file format:**
   - No quotes around the API key
   - No spaces before/after the `=`
   - Correct format: `GEMINI_API_KEY=AIzaSyYourKey`

3. **Restart server after changes:**
   - Environment variables are loaded at startup
   - Changes to `.env` require server restart

---

## 📝 Model Updates

The code has been updated to use:
- **`gemini-1.5-flash`** (recommended - faster, free tier friendly)
- Fallback to `gemini-1.5-pro` if needed

The old `gemini-pro` model is deprecated and may not work with new API keys.

---

## 🎯 Quick Checklist

- [ ] Got new API key from https://makersuite.google.com/app/apikey
- [ ] Updated `backend/.env` with new `GEMINI_API_KEY`
- [ ] Enabled Generative Language API in Google Cloud (if needed)
- [ ] Restarted backend server
- [ ] Tested session report generation
- [ ] No more 403 errors

---

**Need more help?** Check the Google AI Studio documentation:
https://ai.google.dev/docs

