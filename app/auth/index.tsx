import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation values
  const animationProgress = useSharedValue(0);
  const backgroundPosition = useSharedValue(0);

  const toggleForm = () => {
    // Start background animation
    backgroundPosition.value = isLogin ? 1 : 0;

    // Animate out current form
    animationProgress.value = 0.5;
    
    // After timeout, switch form and animate in
    setTimeout(() => {
      setIsLogin(prev => !prev);
      animationProgress.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.cubic)
      });
      
      // Reset for next animation
      setTimeout(() => {
        animationProgress.value = 0;
      }, 500);
    }, 300);
  };

  // Animated styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [1, 0, 1],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      animationProgress.value,
      [0, 0.5, 1],
      [0, 20, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }]
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
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => { /* TODO: Add auth logic */ }}
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
  button: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
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