import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import {SpotifyService} from '../services/SpotifyService';

export const GameScreen = ({navigation}: any) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const timerRef = useRef<any>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initialize Spotify connection
    initSpotify();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      SpotifyService.stopPlayback();
    };
  }, []);

  const initSpotify = async () => {
    try {
      await SpotifyService.connect();
    } catch (error) {
      console.error('Failed to connect to Spotify:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to Spotify. Please try logging in again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ],
      );
    }
  };

  const startRound = async () => {
    try {
      setShowAnswer(false);
      setTimeLeft(30);
      progressAnim.setValue(1);
      
      // Fetch random track
      const track = await SpotifyService.getRandomTrack();
      setCurrentTrack(track);
      
      // Play track
      await SpotifyService.playTrack(track.uri);
      
      setIsPlaying(true);
      
      // Start timer
      startTimer();
    } catch (error) {
      console.error('Error starting round:', error);
      Alert.alert('Error', 'Failed to start round. Please try again.');
    }
  };

  const startTimer = () => {
    let timeRemaining = 30;
    
    timerRef.current = setInterval(() => {
      timeRemaining--;
      setTimeLeft(timeRemaining);
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: timeRemaining / 30,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      if (timeRemaining <= 0) {
        clearInterval(timerRef.current);
        endRound(true); // Timer ended, give point
      }
    }, 1000);
  };

  const skipRound = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    endRound(false); // Skipped, no point
  };

  const endRound = async (earnedPoint: boolean) => {
    setIsPlaying(false);
    await SpotifyService.stopPlayback();
    
    if (earnedPoint) {
      setScore(score + 1);
    }
    
    setShowAnswer(true);
  };

  const nextRound = () => {
    setRound(round + 1);
    setShowAnswer(false);
    startRound();
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SpotifyService.disconnect();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191414" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Spotify Music Quiz</Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Round</Text>
          <Text style={styles.statValue}>{round}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {!isPlaying && !showAnswer ? (
          <View style={styles.readyState}>
            <Text style={styles.readyText}>Ready to play?</Text>
            <Text style={styles.readySubtext}>
              Click "Start Round" to begin!
            </Text>
          </View>
        ) : isPlaying ? (
          <View style={styles.playingState}>
            <Text style={styles.timerText}>{timeLeft}</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[styles.progressBar, {width: progressWidth}]}
              />
            </View>
            <Text style={styles.playingText}>🎵 Song is playing...</Text>
          </View>
        ) : (
          <View style={styles.answerState}>
            <Text style={styles.answerResult}>
              {score >= round - 1 ? '✅ Correct!' : '⏭️ Skipped'}
            </Text>
            <Text style={styles.trackName}>{currentTrack?.name}</Text>
            <Text style={styles.artistName}>by {currentTrack?.artists}</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isPlaying && !showAnswer ? (
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startButtonText}>Start Round</Text>
          </TouchableOpacity>
        ) : isPlaying ? (
          <TouchableOpacity style={styles.skipButton} onPress={skipRound}>
            <Text style={styles.skipButtonText}>Skip (No Points)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={nextRound}>
            <Text style={styles.nextButtonText}>Next Round</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#1DB954',
    borderRadius: 12,
    padding: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#282828',
    borderRadius: 12,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DB954',
    marginBottom: 20,
  },
  readyState: {
    alignItems: 'center',
  },
  readyText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  readySubtext: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  playingState: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#404040',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  playingText: {
    color: '#B3B3B3',
    fontSize: 16,
  },
  answerState: {
    alignItems: 'center',
  },
  answerResult: {
    fontSize: 24,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  trackName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 10,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 18,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  controls: {
    gap: 10,
  },
  startButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#DC143C',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
