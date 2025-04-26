import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

// Use localhost for web, IP for native apps
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3001/api/auth'
  : 'http://192.168.29.223:3001/api/auth';

console.log(`Using API URL: ${API_URL}`);

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for register, -1 for login
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Animation values
  const animationProgress = useSharedValue(0);
  const backgroundPosition = useSharedValue(0);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(API_URL.split('/api/auth')[0], { method: 'GET' });
        console.log('Backend connection test:', response.status >= 200 ? 'Success!' : 'Failed');
      } catch (err) {
        console.log('Backend connection test failed:', err);
      }
    };
    
    testConnection();
  }, []);

  const toggleForm = () => {
    setDirection(isLogin ? 1 : -1); // If currently login, slide right to register; else slide left to login
    backgroundPosition.value = isLogin ? 1 : 0;
    animationProgress.value = 0.5;
    setTimeout(() => {
      setIsLogin(prev => !prev);
      animationProgress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic)
      });
      setTimeout(() => {
        animationProgress.value = 0;
      }, 500);
    }, 300);
  };

  // Register handler
  const handleRegister = async () => {
    console.log('Register button clicked');
    
    if (!email || !username || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    
    setIsLoading(true);
    console.log('Sending register request...');
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName: username }),
      });
      
      console.log('Register response status:', response.status);
      const data = await response.json();
      console.log('Register response data:', data);
      
      if (response.ok) {
        Alert.alert('Success', 'Registration successful! Please login.');
        setIsLogin(true); // Switch to login mode
        setPassword(''); // Clear password field
      } else {
        Alert.alert('Error', data.error || 'Registration failed.');
      }
    } catch (err: unknown) {
      console.log('Register error:', err);
      Alert.alert('Error', `Could not connect to server. ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleLogin = async () => {
    console.log('Login button clicked');
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    
    setIsLoading(true);
    console.log('Sending login request...');
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (response.ok) {
        // Store tokens securely
        if (Platform.OS !== 'web') {
          await SecureStore.setItemAsync('accessToken', data.accessToken);
          await SecureStore.setItemAsync('refreshToken', data.refreshToken);
        } else {
          // For web, use localStorage
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        router.push('/chat'); // Navigate to chat page after login
        Alert.alert('Success', 'Login successful!');
        // Do not navigate yet
      } else {
        Alert.alert('Error', data.error || 'Login failed.');
      }
    } catch (err: unknown) {
      console.log('Login error:', err);
      Alert.alert('Error', `Could not connect to server. ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Animated styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [1, 0, 1],
      Extrapolate.CLAMP
    );
    const translateX = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, direction * 50, 0], // Slide right for register, left for login
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ translateX }]
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      backgroundPosition.value,
      [0, 1],
      [0, width * 0.05],
      Extrapolate.CLAMP
    );

    const scaleX = interpolate(
      backgroundPosition.value,
      [0, 1],
      [1, 1.1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX },
        { scaleX }
      ]
    };
  });

  return (
    <View style={styles.screen}>
      {/* Background animation */}
      <Animated.View 
        style={[
          styles.animatedBackground, 
          backgroundAnimatedStyle
        ]} 
      />

      {/* Form content */}
      <Animated.View style={[
        { width: '100%', maxWidth: 400, alignSelf: 'center', zIndex: 2 },
        formAnimatedStyle
      ]}>
        <Text style={styles.title}>{isLogin ? "Let's Sign you in." : 'Create your account'}</Text>
        <Text style={styles.subtitle}>
          {isLogin ? "Welcome back. You've been missed!" : 'Sign up to get started!'}
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#b0aecd"
        />
        {!isLogin && (
          <>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#b0aecd"
            />
          </>
        )}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { marginBottom: 0, paddingRight: 44 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#b0aecd"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeButton}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#a084e8"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={isLogin ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Sign in' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleForm} style={styles.linkContainer}>
          <Text style={styles.linkText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const PURPLE = '#a084e8';
const LIGHT_PURPLE = '#f3f0ff';
const WHITE = '#fff';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_PURPLE,
    padding: 16,
    overflow: 'hidden', // Important for animation
  },
  animatedBackground: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: -50,
    bottom: -100,
    backgroundColor: '#a084e818',
    borderRadius: 60,
    transform: [{ rotate: '-10deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d2350',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#7c7c8a',
    marginBottom: 24,
    textAlign: 'left',
  },
  label: {
    fontSize: 14,
    color: '#7c7c8a',
    marginBottom: 4,
    marginTop: 12,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#e0d7ff',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: WHITE,
    color: '#2d2350',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    zIndex: 2,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  linkText: {
    color: PURPLE,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 