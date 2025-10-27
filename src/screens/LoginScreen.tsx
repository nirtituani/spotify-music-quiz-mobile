import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {SpotifyAuth} from '../services/SpotifyAuth';

export const LoginScreen = ({navigation}: any) => {
  const handleLogin = async () => {
    try {
      const success = await SpotifyAuth.login();
      if (success) {
        navigation.replace('Game');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191414" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🎵</Text>
        <Text style={styles.title}>Spotify Music Quiz</Text>
        <Text style={styles.subtitle}>Guess the song in 30 seconds!</Text>
      </View>

      {/* Game Preview */}
      <View style={styles.gamePreview}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Round</Text>
          <Text style={styles.statValue}>1</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>

      {/* Login Button */}
      <View style={styles.loginSection}>
        <Text style={styles.loginTitle}>🔒 Login Required</Text>
        <Text style={styles.loginText}>
          Please log in with your Spotify Premium account to play
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login with Spotify</Text>
        </TouchableOpacity>
      </View>

      {/* How to Play */}
      <View style={styles.howToPlay}>
        <Text style={styles.howToPlayTitle}>📖 How to Play</Text>
        <View style={styles.instruction}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.instructionText}>
            Listen to 30 seconds of a random song
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.instructionText}>
            Wait for the timer to end to earn 1 point
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.instructionText}>
            Skip anytime to see the answer (no points)
          </Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.instructionText}>
            Requires Spotify Premium account
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#1DB954',
    fontWeight: '600',
  },
  gamePreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#1DB954',
    borderRadius: 12,
    padding: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  loginSection: {
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginText: {
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  howToPlay: {
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  howToPlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  instruction: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bullet: {
    color: '#1DB954',
    marginRight: 10,
    fontSize: 16,
  },
  instructionText: {
    color: '#B3B3B3',
    fontSize: 14,
    flex: 1,
  },
});
