import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    async function checkTokenAndRedirect() {
      if (loaded) {
        let token = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          token = localStorage.getItem('accessToken');
        } else {
          token = await SecureStore.getItemAsync('accessToken');
        }
        if (token) {
          router.replace('/chat');
        } else {
          router.replace('/auth');
        }
        SplashScreen.hideAsync();
      }
    }
    checkTokenAndRedirect();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/index" options={{ title: 'Auth', headerShown: false }} />
        <Stack.Screen name="chat/index" options={{ title: 'Chats', headerShown: false }} />
        <Stack.Screen name="chat/detail" options={{ title: 'Chat Detail', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
