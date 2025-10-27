# 🎵 Spotify Music Quiz - Mobile App

A native mobile app (Android & iOS) that lets you test your music knowledge by guessing songs from your Spotify library in 30 seconds!

## 🌟 Features

- 🎮 **Native Mobile Experience** - Smooth, native app for Android & iOS
- 🎵 **Full Spotify Integration** - Play full songs using Spotify Premium
- ⏱️ **30-Second Rounds** - Quick and addictive gameplay
- 🏆 **Score Tracking** - Track your progress as you play
- 🎨 **Beautiful UI** - Spotify-themed dark interface
- 🔐 **Secure Authentication** - Spotify OAuth login
- 📱 **Hidden Track Names** - Songs play without revealing the answer!

## 📱 Platforms

- ✅ **Android** 6.0+ (API 23+)
- ✅ **iOS** 13.0+ (when built on Mac)

## 🚀 Quick Start

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for detailed setup instructions.

### Prerequisites

- Node.js 20+
- Android Studio (for Android)
- Xcode (for iOS, Mac only)
- Spotify Premium account
- Spotify Developer App credentials

### Installation

```bash
# Install dependencies
npm install

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## 🏗️ Project Structure

```
SpotifyMusicQuiz/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Spotify OAuth login
│   │   └── GameScreen.tsx       # Main quiz game
│   ├── services/
│   │   ├── SpotifyAuth.ts       # Authentication service
│   │   └── SpotifyService.ts    # Playback & API service
│   └── ...
├── android/                      # Android native code
├── ios/                          # iOS native code  
├── App.tsx                       # App entry point
├── package.json                  # Dependencies
└── MOBILE_SETUP.md              # Detailed setup guide
```

## 🎮 How It Works

1. **Login** - Authenticate with Spotify Premium
2. **Start Round** - App fetches random song and plays it
3. **Listen** - 30 seconds to guess the song (name is hidden!)
4. **Wait or Skip** - Wait for timer = 1 point, Skip = 0 points
5. **See Answer** - Track name and artist revealed
6. **Next Round** - Keep playing to increase your score!

## 🔐 Configuration

### 1. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Add redirect URI: `spotifymusicquiz://callback`
5. Add your Android/iOS package names

### 2. Update Credentials

Edit `src/services/SpotifyAuth.ts`:

```typescript
const SPOTIFY_CLIENT_ID = 'your_client_id_here';
const API_BASE_URL = 'your_backend_url_here';
```

### 3. Backend Integration

This mobile app works with the same backend as the web version:
- Backend repo: https://github.com/nirtituani/spotify-music-quiz
- Production API: https://spotify-music-quiz.pages.dev

You need to add a mobile token exchange endpoint to your backend (see MOBILE_SETUP.md).

## 📦 Dependencies

### Core:
- **React Native 0.82** - Mobile framework
- **React Navigation** - Screen navigation
- **TypeScript** - Type safety

### Spotify:
- **react-native-spotify-remote** - Spotify playback SDK
- **AsyncStorage** - Secure token storage

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run Android (in separate terminal)
npm run android

# Run iOS (Mac only, in separate terminal)
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

## 📱 Testing

### Android:
1. Open Android Studio
2. Create/start an emulator (AVD)
3. Run `npm run android`

### iOS (Mac only):
1. Run `npm run ios`
2. Simulator launches automatically

### Physical Device:
- **Android**: Enable USB debugging, connect device, run `npm run android`
- **iOS**: Connect device, trust developer, build from Xcode

## 🏪 Building for Production

### Android APK:

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### iOS IPA (Mac only):

1. Open `ios/SpotifyMusicQuiz.xcworkspace` in Xcode
2. Product → Archive
3. Export for distribution

## 🐛 Troubleshooting

**"Spotify not installed"**
- Install Spotify app on your device
- Login to Spotify first

**"Authentication failed"**
- Check Client ID is correct
- Verify redirect URI in Spotify dashboard
- Ensure backend is accessible

**Build errors**
- Android: `cd android && ./gradlew clean`
- iOS: Clean build folder in Xcode

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for more troubleshooting.

## 🌐 Related Projects

- **Web Version**: https://spotify-music-quiz.pages.dev
- **GitHub**: https://github.com/nirtituani/spotify-music-quiz
- **Backend**: Hono + Cloudflare Pages

## 📝 Requirements

- **Spotify Premium Account** - Required for playback
- **Internet Connection** - For streaming and API calls
- **Spotify App** - Must be installed on device
- **Modern Device** - Android 6.0+ or iOS 13.0+

## 🎯 Why Mobile App vs Web?

The web version only works on desktop because:
- ❌ Web Playback SDK doesn't work on mobile browsers
- ❌ Preview URLs don't work for all songs
- ❌ Playing in Spotify app shows song name (ruins quiz)

The mobile app solves this:
- ✅ Uses native Spotify SDK (Android/iOS)
- ✅ Full control over UI (hides track names)
- ✅ Plays full songs on mobile
- ✅ Better performance

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

- Spotify Web API
- Spotify Android/iOS SDKs
- React Native
- React Navigation

---

**Made with ❤️ for music lovers!** 🎵

**Questions?** See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for detailed instructions.
