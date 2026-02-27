# 🚀 Quick Start Guide - FitMon Mobile

## Step 1: Install Dependencies

```bash
cd mobile
npm install
```

## Step 2: Configure Backend API

1. Find your computer's IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`
   - **macOS/Linux**: Open Terminal and run `ifconfig`
   - Look for your IPv4 address (e.g., 192.168.1.100)

2. Open `src/services/api.js`

3. Update line 7 with your IP:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP_HERE:3000';
   ```
   Example:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:3000';
   ```

## Step 3: Start Backend Server

Make sure your backend server is running:

```bash
cd ../backend
npm start
```

## Step 4: Run Mobile App

```bash
cd ../mobile
npm start
```

## Step 5: Open on Your Phone

1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)

2. Scan the QR code shown in terminal:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app scanner

3. App will load on your phone!

## ⚠️ Important Notes

- Your phone and computer MUST be on the same Wi-Fi network
- Use your computer's IP address, NOT `localhost` or `127.0.0.1`
- Make sure backend is running before starting mobile app
- If connection fails, check firewall settings

## 📱 Test User Accounts

Use the signup screen to create a new account, or if you have existing accounts from the web version, you can login with those credentials.

## 🎉 You're Ready!

The app includes:
- Landing page with features
- Login & Signup
- Home dashboard with stats
- Workout library with search
- Profile with BMI calculator

Enjoy your FitMon mobile experience!
