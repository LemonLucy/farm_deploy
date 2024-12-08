// src/screens/LoginAndSignupScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://172.20.10.2:5000';
const FORM_WIDTH = 320; // 애니메이션 너비 상수

const LoginAndSignupScreen: React.FC = () => {
  const [isLoginFocused, setIsLoginFocused] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const translateX = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
          router.push('/HomeScreen'); // 로그인 상태면 홈 화면으로 이동
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      }
    };

    checkAuth();
  }, []);

  const toggleFocus = (focusOnLogin: boolean) => {
    setIsLoginFocused(focusOnLogin);
    translateX.value = withTiming(focusOnLogin ? 0 : -FORM_WIDTH, { duration: 500 });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
      });

      Alert.alert('Sign Up Successful', `User created: ${response.data}`);

      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Sign Up Error', error.response?.data?.error || 'An error occurred');
      } else {
        Alert.alert('Sign Up Error', 'An unknown error occurred');
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      const { AccessToken } = response.data;

      if (!AccessToken) {
        throw new Error('Login response does not contain a token');
      }

      // AsyncStorage에 로그인 상태 및 토큰 저장
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('userToken', AccessToken);

      Alert.alert('Login Successful');
      router.push('/HomeScreen');
    } catch (error) {
      console.error('Error during sign in:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Login Error', error.response?.data?.error || 'An error occurred');
      } else {
        Alert.alert('Login Error', 'An unknown error occurred');
      }
    }
  };

  const animatedLoginStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: withTiming(isLoginFocused ? 1 : 0.5, { duration: 500 }),
  }));

  const animatedSignupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + FORM_WIDTH }],
    opacity: withTiming(isLoginFocused ? 0.5 : 1, { duration: 500 }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.formContainer, animatedLoginStyle]}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Sign In" onPress={handleSignIn} color="#4CAF50" />
        <Pressable onPress={() => toggleFocus(false)}>
          <Text style={!isLoginFocused ? styles.activeButton : styles.inactiveButton}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.formContainer, animatedSignupStyle]}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button title="Sign Up" onPress={handleSignUp} color="#4CAF50" />
        <Pressable onPress={() => toggleFocus(true)}>
          <Text style={isLoginFocused ? styles.activeButton : styles.inactiveButton}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  activeButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  inactiveButton: {
    fontSize: 16,
    color: '#81C784',
  },
  formContainer: {
    position: 'absolute',
    width: FORM_WIDTH,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    borderColor: '#388E3C',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  input: {
    height: 40,
    borderColor: '#66BB6A',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F1F8E9',
  },
});

export default LoginAndSignupScreen;
