# FitMon - Android App

A standalone Android fitness tracking application built with Java and Material Design.

## Features

- 🎯 **Landing Page** - Welcome screen with app features
- 🔐 **Authentication** - Login and Signup with local storage
- 🏠 **Home Dashboard** - View stats and quick actions
- 💪 **Workouts Library** - Browse exercise list
- 👤 **User Profile** - View profile and logout

## Requirements

- **Android Studio** Hedgehog (2023.1.1) or newer
- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Java 11** or higher

## Setup Instructions

### 1. Open Project in Android Studio

1. Launch Android Studio
2. Click **File** → **Open**
3. Navigate to the `android` folder: `Desktop/RemoRehab - Copy (2)/android`
4. Click **OK**

### 2. Wait for Gradle Sync

Android Studio will automatically:
- Download Gradle 8.2
- Sync dependencies (Material Components, AppCompat, ConstraintLayout)
- Index project files

This may take 2-5 minutes on first launch.

### 3. Run the App

**On Physical Device:**
1. Enable Developer Options on your phone
2. Enable USB Debugging
3. Connect phone via USB
4. Click the **Run** button (green triangle) in Android Studio
5. Select your device from the list

**On Emulator:**
1. Click **Device Manager** in Android Studio
2. Create a new Virtual Device (recommend Pixel 5 with API 34)
3. Click the **Run** button
4. Select the emulator

### 4. Build APK (Optional)

To create an installable APK:

```bash
cd android
gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## App Architecture

### Activities

- **LandingActivity** - App entry point with Get Started/Sign In buttons
- **LoginActivity** - User login form
- **SignupActivity** - New user registration
- **MainActivity** - Home dashboard with stats and navigation
- **WorkoutsActivity** - Exercise library list
- **ProfileActivity** - User profile and logout

### Data Storage

Uses **SharedPreferences** for local data:
- Username
- Email
- Login state

### Navigation

- **Intent-based** navigation between activities
- **Bottom Navigation Bar** on main screens (Home, Workouts, Profile)

## Offline Mode

✅ **Fully Offline** - No backend connection required
✅ **Hardcoded Data** - Mock stats and workout list
✅ **Local Storage** - User data persists via SharedPreferences

## Troubleshooting

### Gradle Sync Failed

**Error:** "Could not resolve dependencies"

**Solution:**
1. Check internet connection
2. Click **File** → **Invalidate Caches** → **Invalidate and Restart**
3. Try again

### App Crashes on Launch

**Check:**
- Minimum SDK is API 24 or higher
- All layout files are present in `res/layout`
- All resource files exist in `res/values`

### Build Errors

**Common fixes:**
```bash
# Clean and rebuild
cd android
gradlew clean
gradlew build
```

## Project Structure

```
android/
├── app/
│   ├── build.gradle                 # App dependencies
│   └── src/main/
│       ├── AndroidManifest.xml      # App configuration
│       ├── java/com/fitmon/app/     # Java source files
│       │   ├── LandingActivity.java
│       │   ├── LoginActivity.java
│       │   ├── SignupActivity.java
│       │   ├── MainActivity.java
│       │   ├── WorkoutsActivity.java
│       │   └── ProfileActivity.java
│       └── res/                     # Resources
│           ├── layout/              # XML layouts
│           ├── values/              # Colors, strings, themes
│           └── menu/                # Bottom navigation menu
├── build.gradle                     # Root build script
└── settings.gradle                  # Project settings
```

## Tech Stack

- **Language:** Java
- **UI:** Material Design Components 1.11.0
- **Layout:** ConstraintLayout, CardView
- **Navigation:** BottomNavigationView, Intents
- **Storage:** SharedPreferences
- **Min SDK:** 24 (Android 7.0)
- **Target SDK:** 34 (Android 14)

## Features Explained

### Landing Screen
- FitMon branding with green accent
- Feature cards highlighting app capabilities
- Get Started button → Signup
- Sign In button → Login

### Login/Signup
- Material Design text fields
- Password visibility toggle
- Simple form validation
- Saves user data locally

### Home Dashboard
- Personalized greeting
- Workout and streak stats
- Quick action cards
- Bottom navigation

### Workouts
- Hardcoded exercise list
- Material card design
- Back button navigation

### Profile
- User avatar with initial
- Display username and email
- Mock stats (workouts, streak, BMI)
- Logout button (clears data)

## Color Scheme

Matching the web app design:

- **Background:** `#030303` (near black)
- **Cards:** `#1a1a1a` (dark gray)
- **Primary:** `#00e676` (neon green)
- **Text:** `#ffffff` (white)
- **Secondary Text:** `#a0a0a0` (light gray)

## Next Steps

To connect to backend (optional):
1. Add Retrofit/OkHttp dependencies
2. Create API service layer
3. Replace SharedPreferences with real authentication
4. Add network permission to AndroidManifest.xml
5. Implement API calls in activities

## Support

For issues or questions, check:
- Android Studio build output
- Logcat for runtime errors
- Gradle sync messages

---

**Made with ❤️ for FitMon**
