import React, {useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {LoginScreen} from './src/screens/LoginScreen';
import {GameScreen} from './src/screens/GameScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#191414'}}>
      <StatusBar barStyle="light-content" backgroundColor="#191414" />
      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <GameScreen onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

export default App;
