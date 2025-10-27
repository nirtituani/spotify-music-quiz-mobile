import Spotify from 'rn-spotify-sdk';
import {SpotifyAuth} from './SpotifyAuth';

const API_BASE_URL = 'https://spotify-music-quiz.pages.dev';

export class SpotifyService {
  private static isConnected = false;

  static async connect(): Promise<void> {
    try {
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      // Initialize Spotify SDK
      const initialized = await Spotify.initialize({
        clientID: 'YOUR_SPOTIFY_CLIENT_ID', // Will be configured
        redirectURL: 'spotifymusicquiz://callback',
        scopes: ['streaming', 'user-read-private', 'user-read-email'],
      });

      if (initialized) {
        // Set access token
        await Spotify.setAccessToken(token);
        this.isConnected = true;
        console.log('Connected to Spotify');
      }
    } catch (error) {
      console.error('Failed to connect to Spotify:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.isConnected) {
        await Spotify.logout();
        this.isConnected = false;
      }
      await SpotifyAuth.logout();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  }

  static async getRandomTrack(): Promise<any> {
    try {
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      // Call your backend API to get random track
      const response = await fetch(`${API_BASE_URL}/api/random-track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch random track');
      }

      const track = await response.json();
      return track;
    } catch (error) {
      console.error('Error fetching random track:', error);
      throw error;
    }
  }

  static async playTrack(uri: string): Promise<void> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      await Spotify.playURI(uri, 0, 0);
      console.log('Playing track:', uri);
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  static async stopPlayback(): Promise<void> {
    try {
      if (this.isConnected) {
        await Spotify.setPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }

  static async getCurrentPlayerState(): Promise<any> {
    try {
      if (!this.isConnected) {
        return null;
      }
      return await Spotify.getPlayerState();
    } catch (error) {
      console.error('Error getting player state:', error);
      return null;
    }
  }
}
