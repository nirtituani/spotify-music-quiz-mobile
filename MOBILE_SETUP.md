# 📱 Spotify Music Quiz - Mobile App Setup Guide

## 🎯 Overview

This is the **React Native mobile app** version of Spotify Music Quiz. It works on both Android and iOS, allowing users to play the music quiz game using their Spotify Premium account.

## ✨ Features

- ✅ Native mobile app (Android & iOS)
- ✅ Spotify authentication & playback
- ✅ 30-second music quiz rounds
- ✅ Real-time scoring system
- ✅ Beautiful UI matching Spotify's design
- ✅ Play full songs without showing track names

## 📋 Prerequisites

### Required Software:

**For Android Development (PC/Mac/Linux):**
- Node.js 20+
- Java JDK 17+
- Android Studio with Android SDK
- React Native CLI

**For iOS Development (Mac Only):**
- Xcode 14+
- CocoaPods
- iOS Simulator

### Spotify Developer Account:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Note your **Client ID** and **Client Secret**
4. Add redirect URI: `spotifymusicquiz://callback`
5. Add Android/iOS package names in settings

## 🚀 Installation

### 1. Install Dependencies

```bash
cd SpotifyMusicQuiz
npm install
```

### 2. Configure Spotify Credentials

Edit `src/services/SpotifyAuth.ts`:

```typescript
const SPOTIFY_CLIENT_ID = 'your_client_id_here';
const SPOTIFY_REDIRECT_URI = 'spotifymusicquiz://callback';
const API_BASE_URL = 'https://spotify-music-quiz.pages.dev'; // Your backend
```

### 3. Android Setup

#### a. Configure AndroidManifest.xml

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <application>
    <!-- Add this inside <application> tag -->
    <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    
    <!-- Add intent filter for Spotify callback -->
    <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data
        android:scheme="spotifymusicquiz"
        android:host="callback" />
    </intent-filter>
  </application>
</manifest>
```

#### b. Add Spotify SDK Repository

Edit `android/build.gradle`:

```gradle
allprojects {
    repositories {
        // Add this
        maven { url 'https://jitpack.io' }
    }
}
```

#### c. Run on Android

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android

# Or run on specific device
npx react-native run-android --deviceId=DEVICE_ID
```

### 4. iOS Setup (Mac Only)

#### a. Install Pods

```bash
cd ios
pod install
cd ..
```

#### b. Configure Info.plist

Add to `ios/SpotifyMusicQuiz/Info.plist`:

```xml
<dict>
  <!-- Add this -->
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>spotifymusicquiz</string>
      </array>
    </dict>
  </array>
</dict>
```

#### c. Run on iOS

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios

# Or specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

## 🔧 Backend Integration

The mobile app uses the same backend as the web version:

**Backend API:** `https://spotify-music-quiz.pages.dev`

### Required Endpoints:

- `POST /api/auth/token` - Exchange auth code for access token
- `GET /api/random-track` - Get random track for quiz

### Adding Mobile Token Exchange

You need to add a new endpoint to your Hono backend for mobile apps:

```typescript
// In your src/index.tsx
app.post('/api/auth/token', async (c) => {
  const {code, redirect_uri} = await c.req.json();
  
  const clientId = c.env.SPOTIFY_CLIENT_ID;
  const clientSecret = c.env.SPOTIFY_CLIENT_SECRET;
  
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    })
  });
  
  const data = await tokenResponse.json();
  return c.json(data);
});
```

## 📱 Testing

### Android Emulator

1. Open Android Studio
2. Start an emulator (AVD Manager)
3. Run `npm run android`

### iOS Simulator (Mac only)

1. Run `npm run ios`
2. Simulator will launch automatically

### Physical Device

#### Android:
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect via USB
4. Run `npm run android`

#### iOS:
1. Open Xcode
2. Select your device
3. Trust developer certificate
4. Build from Xcode or `npm run ios`

## 🎮 How It Works

### Authentication Flow:

1. User taps "Login with Spotify"
2. App opens Spotify OAuth in browser
3. User approves permissions
4. Spotify redirects to `spotifymusicquiz://callback?code=XXX`
5. App catches the redirect
6. Exchanges code for access token via backend
7. Stores token securely in AsyncStorage
8. Connects to Spotify Remote SDK

### Playback Flow:

1. User taps "Start Round"
2. App fetches random track from backend
3. Plays track using Spotify Remote SDK
4. Track info is hidden in app UI
5. Timer counts down 30 seconds
6. User can skip or wait for timer
7. Answer is revealed after round ends

### Why Mobile Works (vs Web):

- **Native SDK**: Uses Spotify's Android/iOS SDKs (not Web Playback SDK)
- **App Control**: Full control over UI - can hide track names
- **Background Play**: Can continue playing in background
- **Better Performance**: Native performance vs web browser

## 🐛 Troubleshooting

### "Spotify not installed" error
- Install Spotify app on device
- Open Spotify and login
- Try again in quiz app

### "Authentication failed" error
- Check Client ID in `SpotifyAuth.ts`
- Verify redirect URI matches Spotify dashboard
- Check backend is running and accessible

### "No internet connection" error
- Check device/emulator has internet
- Verify backend URL is correct
- Try accessing backend URL in browser

### Android build fails
- Run `cd android && ./gradlew clean`
- Delete `android/app/build` folder
- Rebuild: `npm run android`

### iOS build fails (Mac)
- Run `cd ios && pod install`
- Clean build folder in Xcode (Shift+Cmd+K)
- Rebuild from Xcode

## 📦 Building for Production

### Android APK:

```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS IPA (Mac Only):

1. Open `ios/SpotifyMusicQuiz.xcworkspace` in Xcode
2. Select "Generic iOS Device"
3. Product → Archive
4. Export IPA for distribution

## 🚀 Publishing

### Google Play Store (Android):

1. Create Google Play Developer account ($25 one-time)
2. Create app listing
3. Upload APK/AAB
4. Fill in store details
5. Submit for review

### Apple App Store (iOS):

1. Enroll in Apple Developer Program ($99/year)
2. Create App ID in Apple Developer Portal
3. Create app in App Store Connect
4. Upload build from Xcode
5. Submit for review

## 📝 Next Steps

- [ ] Install dependencies: `npm install`
- [ ] Configure Spotify credentials
- [ ] Add backend token exchange endpoint
- [ ] Test on Android emulator
- [ ] Test on iOS simulator (if Mac)
- [ ] Test on physical device
- [ ] Build release APK/IPA
- [ ] Submit to app stores

## 🙋 Need Help?

The mobile app is a separate codebase from the web version but uses the same backend API. Both web and mobile versions work together!

**Project Structure:**
```
/home/user/
├── webapp/              # Web version (Hono + Cloudflare Pages)
└── SpotifyMusicQuiz/    # Mobile version (React Native)
```

Happy coding! 🎵📱
