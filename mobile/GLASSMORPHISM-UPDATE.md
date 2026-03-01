# FitMon Mobile - Upgraded with Glassmorphism UI

## 🎨 New Features

### ✨ Glassmorphism Design
- **Telegram-inspired UI** with frosted glass effects
- **BlurView components** for modern, sleek design
- **Gradient overlays** with neon green accents
- **Smooth animations** and transitions

### 📺 YouTube Video Integration
- **Embedded YouTube player** in workout detail screens
- **Full-screen video support** with WebView
- **6 pre-loaded workouts** with real YouTube videos:
  - Dynamic Warm-Up Routine
  - Core Stability Training
  - Resistance Band Workout
  - Bodyweight HIIT
  - Leg Day Power Workout
  - Yoga Flow for Athletes

### 🎯 Enhanced Navigation
- **Smooth transitions** between screens
- **Modal presentation** for workout details
- **Gesture-based navigation** (swipe to dismiss)

## 🚀 Quick Start

### Install Dependencies

```bash
cd mobile
npm install
```

**New packages added:**
- `expo-blur` - Glassmorphism blur effects
- `expo-av` - Video playback support
- `react-native-webview` - YouTube embed player

### Run the App

```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go app

## 📱 Screen Overview

### Workout Library Screen
- **Glass search bar** with live filtering
- **Category chips** with blur effects
- **Glass workout cards** with:
  - Category badges (color-coded)
  - Difficulty indicators
  - Duration and calorie stats
  - Play button overlays

### Workout Detail Screen
- **YouTube video player** (embedded WebView)
- **Glass info cards** with workout details
- **Step-by-step instructions** with numbered steps
- **Gradient action button** to start workout
- **Back navigation** with glass button

## 🎨 Design System

### Colors
- **Background:** Ultra-dark (#030303)
- **Primary:** Electric green (#00e676)
- **Accents:** Cyber blue, cyan, purple
- **Glass:** Semi-transparent with blur

### Typography
- **Headers:** 800 weight, 32px
- **Titles:** 700 weight, 20px
- **Body:** 500-600 weight, 14-16px

### Components
- **BlurView intensity:** 60-95
- **Border radius:** 16-20px
- **Border color:** Semi-transparent white
- **Shadow:** Colored glows on buttons

## 🎬 YouTube Videos

Each workout includes YouTube video IDs:
- Videos auto-play inline
- Full-screen mode supported
- Modest branding (no YouTube logo clutter)
- Related videos disabled

## 📦 File Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── WorkoutsScreen.js      ← Glass UI with mock data
│   │   ├── WorkoutDetailScreen.js  ← YouTube player + details
│   │   ├── HomeScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── LandingScreen.js
│   │   ├── LoginScreen.js
│   │   └── SignupScreen.js
│   ├── styles/
│   │   ├── colors.js               ← Extended color palette
│   │   └── globalStyles.js
│   └── services/
│       └── api.js
├── App.js                          ← Updated navigation
└── package.json                    ← New dependencies
```

## 🔧 Customization

### Add More Workouts

Edit `WorkoutsScreen.js`:

```javascript
const MOCK_WORKOUTS = [
  {
    id: 7,
    name: 'Your Workout Name',
    category: 'cardio', // upper, lower, core, cardio, flexibility
    description: 'Brief description',
    videoUrl: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
    duration: '15 min',
    difficulty: 'Intermediate', // Beginner, Intermediate, Advanced
    calories: 150,
    instructions: [
      'Step 1...',
      'Step 2...',
    ],
  },
];
```

### Change Glassmorphism Intensity

Adjust `BlurView` intensity (0-100):
```javascript
<BlurView intensity={80} tint="dark">
  {/* Your content */}
</BlurView>
```

### Customize Colors

Edit `src/styles/colors.js`:
```javascript
export const colors = {
  green: '#00e676',    // Primary accent
  blue: '#2979ff',     // Secondary
  // ... add more colors
};
```

## ⚡ Performance Tips

- **Videos load on-demand** (only when detail screen opens)
- **Blur effects optimized** with intensity control
- **Smooth 60fps animations** on most devices
- **Lazy loading** for workout cards

## 🐛 Troubleshooting

### Videos Not Playing
- Check internet connection
- Verify YouTube video IDs are valid
- Ensure WebView permissions enabled

### Blur Effects Not Working
- iOS: Should work automatically
- Android: Requires Android 12+ for best results
- Fallback: Semi-transparent backgrounds

### Navigation Issues
- Clear Metro bundler cache: `npm start -- --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📸 Screenshots

The new UI features:
- ✨ Frosted glass cards with blur
- 🎨 Gradient overlays
- 🎯 Clean, modern Telegram-style design
- 📱 Consistent spacing and typography
- 🌈 Color-coded categories

## 🎯 Next Steps

1. **Run the app:** `npm start`
2. **Tap a workout** to see YouTube video
3. **Try different categories** in glass chips
4. **Search workouts** with glass search bar
5. **Enjoy the smooth animations!**

---

**Built with:** React Native, Expo, BlurView, WebView, and love ❤️
