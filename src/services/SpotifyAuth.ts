import {Linking, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace these with your actual Spotify App credentials
// Get them from: https://developer.spotify.com/dashboard
const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_REDIRECT_URI = 'spotifymusicquiz://callback';

// For production, use your deployed backend
// For local testing, use your computer's IP (not localhost!)
const API_BASE_URL = 'https://spotify-music-quiz.pages.dev';

export class SpotifyAuth {
  static async login(): Promise<boolean> {
    try {
      // Build authorization URL
      const scope = 'user-read-private user-read-email app-remote-control streaming';
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${SPOTIFY_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(scope)}`;

      // Open Spotify login in browser
      const supported = await Linking.canOpenURL(authUrl);
      if (supported) {
        await Linking.openURL(authUrl);
        
        // Listen for callback
        return new Promise((resolve) => {
          const handleUrl = async ({url}: {url: string}) => {
            if (url.startsWith(SPOTIFY_REDIRECT_URI)) {
              // Remove listener
              Linking.removeAllListeners('url');
              
              // Extract authorization code
              const code = this.extractCodeFromUrl(url);
              
              if (code) {
                // Exchange code for access token
                const success = await this.exchangeCodeForToken(code);
                resolve(success);
              } else {
                resolve(false);
              }
            }
          };
          
          Linking.addEventListener('url', handleUrl);
        });
      } else {
        Alert.alert('Error', 'Cannot open Spotify login');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login with Spotify');
      return false;
    }
  }

  private static extractCodeFromUrl(url: string): string | null {
    const match = url.match(/code=([^&]+)/);
    return match ? match[1] : null;
  }

  private static async exchangeCodeForToken(code: string): Promise<boolean> {
    try {
      // Call your backend to exchange code for token
      // This keeps your client secret secure on the server
      const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        // Store tokens securely
        await AsyncStorage.setItem('spotify_access_token', data.access_token);
        if (data.refresh_token) {
          await AsyncStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token exchange error:', error);
      return false;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('spotify_access_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('spotify_access_token');
      await AsyncStorage.removeItem('spotify_refresh_token');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  static async isLoggedIn(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }
}
