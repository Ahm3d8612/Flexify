
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import getTheme from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

function ThemedStatusBar() {
  const { isDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
    </ThemeProvider>
  );
}
