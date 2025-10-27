import {SpotifyAuth} from './SpotifyAuth';
import {Linking, Alert} from 'react-native';

const API_BASE_URL = 'https://spotify-music-quiz.pages.dev';

export class SpotifyService {
  private static playbackCheckInterval: any = null;

  static async connect(): Promise<void> {
    try {
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      console.log('Connected to Spotify API');
    } catch (error) {
      console.error('Failed to connect to Spotify:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.playbackCheckInterval) {
        clearInterval(this.playbackCheckInterval);
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
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      // First, check if user has any active devices
      const devicesResponse = await fetch(
        'https://api.spotify.com/v1/me/player/devices',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const devicesData = await devicesResponse.json();

      if (!devicesData.devices || devicesData.devices.length === 0) {
        // No active devices - prompt user to open Spotify app
        Alert.alert(
          'Open Spotify App',
          'Please open the Spotify app on your device and start playing any song, then come back here and try again.',
          [
            {
              text: 'Open Spotify',
              onPress: () => {
                // Try to open Spotify app
                Linking.openURL('spotify:').catch(() => {
                  Alert.alert(
                    'Spotify Not Found',
                    'Please install the Spotify app first.',
                  );
                });
              },
            },
            {text: 'Cancel', style: 'cancel'},
          ],
        );
        throw new Error('No active Spotify devices');
      }

      // Get the first available device
      const deviceId = devicesData.devices[0].id;

      // Play the track on that device
      const playResponse = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        },
      );

      if (!playResponse.ok) {
        const errorData = await playResponse.json();
        console.error('Play error:', errorData);
        throw new Error('Failed to play track');
      }

      console.log('Playing track:', uri);
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  static async stopPlayback(): Promise<void> {
    try {
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        return;
      }

      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }

  static async getCurrentPlayerState(): Promise<any> {
    try {
      const token = await SpotifyAuth.getAccessToken();
      if (!token) {
        return null;
      }

      const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        return null; // No active playback
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting player state:', error);
      return null;
    }
  }
}
