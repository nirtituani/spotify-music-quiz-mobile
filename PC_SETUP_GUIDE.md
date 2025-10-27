# 🖥️ PC Setup Guide - Step by Step

## What You'll Do on Your PC

This guide will help you get the mobile app running on your Windows PC for Android development.

---

## 📦 STEP 1: Download the Project to Your PC

### Option A: Download as ZIP (Easiest)

1. **Create a backup:**
   - The project is at `/home/user/SpotifyMusicQuiz` in this sandbox
   - We need to get it to your actual PC

2. **Download method:**
   ```bash
   # I'll create a downloadable package for you
   # Run this in the sandbox:
   cd /home/user
   tar -czf SpotifyMusicQuiz.tar.gz SpotifyMusicQuiz/
   ```

3. **On your PC:**
   - Download the `SpotifyMusicQuiz.tar.gz` file
   - Extract it to a folder like `C:\Projects\SpotifyMusicQuiz`

### Option B: Use Git (Recommended)

We can push this to GitHub so you can clone it on your PC!

---

## 🔧 STEP 2: Install Required Software on Your PC

### 1. Node.js (Required)

**Download:** https://nodejs.org/
- Version: 20.x or newer (LTS version)
- Click "Next, Next, Finish" during installation
- **Test it works:**
  - Open Command Prompt (cmd)
  - Type: `node --version`
  - Should show: `v20.x.x`

### 2. Java JDK (Required for Android)

**Download:** https://adoptium.net/
- Version: Java 17 (LTS)
- Download "Windows x64" installer
- Install to default location
- **Set environment variable:**
  - Search "Environment Variables" in Windows
  - Click "Environment Variables" button
  - Add new System Variable:
    - Name: `JAVA_HOME`
    - Value: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
  - Edit "Path" variable, add: `%JAVA_HOME%\bin`

**Test it works:**
- Open NEW Command Prompt
- Type: `java -version`
- Should show: `openjdk version "17.x.x"`

### 3. Android Studio (Required for Android)

**Download:** https://developer.android.com/studio
- ~1GB download, ~3GB installed
- During installation:
  - ✅ Check "Android SDK"
  - ✅ Check "Android SDK Platform"
  - ✅ Check "Android Virtual Device"

**After installation:**
1. Open Android Studio
2. Click "More Actions" → "SDK Manager"
3. In "SDK Platforms" tab, check:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
4. In "SDK Tools" tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Click "Apply" and wait for downloads

**Set Android environment variables:**
- Add System Variable:
  - Name: `ANDROID_HOME`
  - Value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
- Edit "Path" variable, add:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\tools`

**Test it works:**
- Open NEW Command Prompt
- Type: `adb version`
- Should show Android Debug Bridge info

---

## 📱 STEP 3: Create Android Emulator

1. **Open Android Studio**
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select a phone (recommended: **Pixel 6**)
5. Click "Next"
6. Download system image: **Tiramisu (API 33)** or **S (API 31)**
7. Click "Next" → "Finish"
8. **Start the emulator** by clicking the ▶️ play button

**Your emulator should boot up!** (Takes 1-2 minutes first time)

---

## 🚀 STEP 4: Install Project Dependencies

1. **Open Command Prompt** (or PowerShell)
2. **Navigate to project:**
   ```cmd
   cd C:\Projects\SpotifyMusicQuiz
   ```

3. **Install dependencies:**
   ```cmd
   npm install
   ```
   - This downloads all required packages (~500MB)
   - Takes 5-10 minutes
   - You'll see a progress bar

**If you see errors:** That's okay! We'll fix them next.

---

## 🔑 STEP 5: Configure Spotify Credentials

### Get Spotify Developer Credentials:

1. Go to: https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in:
   - **App name:** Spotify Music Quiz Mobile
   - **App description:** Mobile quiz game
   - **Redirect URI:** `spotifymusicquiz://callback`
   - **Which API:** Web API
   - Check the agreements box
5. Click "Save"
6. Click "Settings" button
7. **Copy your Client ID** (looks like: `abc123def456...`)
8. **Copy your Client Secret** (click "View client secret")

### Update the App Code:

1. Open the project in a text editor (VS Code, Notepad++, etc.)
2. Open: `src/services/SpotifyAuth.ts`
3. Find this line:
   ```typescript
   const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
   ```
4. Replace with your actual Client ID:
   ```typescript
   const SPOTIFY_CLIENT_ID = 'abc123def456...'; // Your real ID
   ```
5. **Save the file**

---

## 🎮 STEP 6: Run the App!

### Make sure:
- ✅ Android emulator is running (you can see the phone screen)
- ✅ npm install finished successfully
- ✅ Spotify credentials are configured

### Run the app:

**Open TWO Command Prompts:**

**Command Prompt #1 - Start Metro Bundler:**
```cmd
cd C:\Projects\SpotifyMusicQuiz
npm start
```
- This starts the JavaScript bundler
- Keep this window open!
- You'll see: "Welcome to Metro" and some QR code

**Command Prompt #2 - Build and Run Android:**
```cmd
cd C:\Projects\SpotifyMusicQuiz
npm run android
```
- This builds the Android app
- Installs it on the emulator
- Takes 3-5 minutes first time
- You'll see lots of build messages

### If successful:
- The app will open on the emulator! 🎉
- You'll see the login screen with "Login with Spotify" button

---

## ❌ Common Problems & Solutions

### "adb not found"
- Close Command Prompt and open a NEW one
- Run: `adb version` to test
- If still fails: Check ANDROID_HOME path

### "SDK location not found"
- Create file: `android/local.properties`
- Add line: `sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk`
- Replace YOUR_USERNAME with your Windows username

### "Java not found"
- Close Command Prompt and open a NEW one
- Run: `java -version` to test
- If still fails: Check JAVA_HOME path

### "Unable to load script"
- Make sure Metro bundler is running (Command Prompt #1)
- Press 'R' in the emulator to reload

### Build takes forever
- First build takes 5-10 minutes (downloads dependencies)
- Next builds are much faster (30 seconds)

### "No devices found"
- Make sure emulator is running
- In emulator window, you should see a phone screen
- Run: `adb devices` - should show emulator

---

## 🎯 What Happens Next?

Once the app runs:
1. You'll see the **Login Screen**
2. Click "Login with Spotify"
3. **PROBLEM**: The login won't work yet! Why?
   - The OAuth callback needs backend support
   - We need to add an endpoint to your backend
   - I'll help you with this in Step 2!

For now, getting the app to **build and run** is a huge win! 🎉

---

## 📊 Progress Checklist

On your PC, you need to:

- [ ] Download project to PC
- [ ] Install Node.js
- [ ] Install Java JDK 17
- [ ] Install Android Studio
- [ ] Set up environment variables (JAVA_HOME, ANDROID_HOME)
- [ ] Create Android emulator
- [ ] Run emulator
- [ ] Navigate to project folder
- [ ] Run `npm install`
- [ ] Configure Spotify Client ID
- [ ] Run `npm start` (Metro bundler)
- [ ] Run `npm run android` (in separate window)
- [ ] See the app open on emulator! 🎉

---

## 🆘 Getting Stuck?

Common places people get stuck:
1. **Environment variables** - Remember to open NEW Command Prompt after setting them
2. **Emulator not starting** - Give it 2-3 minutes, it's slow first time
3. **Build errors** - Most are fixed by `npm install` or restarting Command Prompt

---

## ⏭️ After This Works

Once you can see the app running on the emulator:
1. ✅ You've successfully set up Android development!
2. ⏭️ Next: Add backend endpoint for mobile login
3. ⏭️ Then: Full testing of the game

---

**Questions? Issues? Let me know where you get stuck and I'll help!** 🚀
