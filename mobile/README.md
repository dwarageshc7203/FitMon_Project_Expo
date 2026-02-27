# FitMon Mobile App

A modern, AI-powered fitness companion mobile application built with React Native and Expo.

## 📱 Features

- **Landing Page**: Beautiful onboarding experience with feature highlights
- **Authentication**: Login and signup with role selection (Athlete/Coach)
- **Home Dashboard**: Quick stats, activity feed, and quick actions
- **Workout Library**: Browse exercise videos with search and category filters
- **Profile Management**: Update personal info, track BMI, and manage settings

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS/Android)

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API configuration:
   - Open `src/services/api.js`
   - Change `API_BASE_URL` to your backend server IP address
   - Example: `http://192.168.1.100:3000` (replace with your IP)

### Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

3. The app will open on your device!

### Alternative Run Commands

```bash
npm run android  # Run on Android emulator
npm run ios      # Run on iOS simulator (macOS only)
npm run web      # Run in web browser
```

## 📂 Project Structure

```
mobile/
├── App.js                      # Main app entry point with navigation
├── src/
│   ├── screens/
│   │   ├── LandingScreen.js   # Welcome/onboarding screen
│   │   ├── LoginScreen.js     # User login
│   │   ├── SignupScreen.js    # User registration
│   │   ├── HomeScreen.js      # Main dashboard
│   │   ├── WorkoutsScreen.js  # Workout library
│   │   └── ProfileScreen.js   # User profile & settings
│   ├── services/
│   │   └── api.js             # API service layer
│   └── styles/
│       ├── colors.js          # Color system
│       └── globalStyles.js    # Shared styles
├── app.json                    # Expo configuration
└── package.json               # Dependencies
```

## 🎨 Design System

The app uses a dark, modern design inspired by the web version:

- **Colors**: Ultra-dark base with neon green accents
- **Typography**: Space Grotesk (headings) + Inter (body)
- **Components**: Glass-morphism cards, smooth animations

## 🔧 Configuration

### Backend API

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000';
```

**Finding Your IP Address:**

- **Windows**: Run `ipconfig` in Command Prompt
- **macOS/Linux**: Run `ifconfig` in Terminal
- Look for IPv4 address (e.g., 192.168.x.x)

### Important Notes

- Your phone and computer must be on the **same Wi-Fi network**
- Use your computer's local IP address, not localhost or 127.0.0.1
- Make sure the backend server is running on port 3000

## 📦 Dependencies

- **expo**: ~54.0.0 - React Native framework
- **@react-navigation**: Navigation library
- **axios**: HTTP client for API calls
- **@react-native-async-storage**: Local data storage
- **expo-linear-gradient**: Gradient backgrounds
- **@expo/vector-icons**: Ionicons icon set

## 🔨 Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS IPA

```bash
eas build --platform ios
```

## 📝 Notes

- Session monitoring features have been removed (available only on web)
- Profile editing currently updates local state only
- Workout videos open in external browser/app
- BMI is calculated automatically from height/weight

## 🐛 Troubleshooting

**Cannot connect to backend:**
- Verify backend server is running
- Check IP address in `api.js`
- Ensure phone and computer are on same network
- Disable firewall temporarily to test

**Expo app won't load:**
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo Go app to latest version

**Build errors:**
- Check Node.js version: `node -v` (should be v16+)
- Check Expo version compatibility
- Run: `npm install` to ensure all deps are installed

## 🤝 Support

For issues or questions, check the main project README or backend documentation.

## 📄 License

Part of the RemoRehab/FitMon project.
