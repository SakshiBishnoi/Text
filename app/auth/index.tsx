import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

function getLiquidPath(progress: number, width: number, height: number) {
  // This is a simple morph between two shapes for demo purposes.
  // You can tweak the control points for a more dramatic liquid effect.
  // progress: 0 (login), 1 (register)
  const curve = 80 + 120 * progress; // morph the curve
  return `M0,0 H${width} V${height} H0 V${height - curve} Q${width / 2},${height - curve - 60 * progress} ${width},${height - curve} V0 Z`;
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    d: getLiquidPath(progress.value, width, height),
  }));

  const toggleForm = () => {
    progress.value = withTiming(isLogin ? 1 : 0, { duration: 700 });
    setTimeout(() => setIsLogin((prev) => !prev), 350); // switch form mid-animation
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={{ width: '100%', maxWidth: 400, alignSelf: 'center', zIndex: 2 }}>
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
      {/* Liquid animation overlay */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <AnimatedPath animatedProps={animatedProps} fill="#a084e8" opacity={0.13} />
      </Svg>
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