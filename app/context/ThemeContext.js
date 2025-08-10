
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import getTheme from '../../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    (async () => {
      const dark = await AsyncStorage.getItem('darkMode');
      const theme = await AsyncStorage.getItem('colorTheme');
      if (dark !== null) setIsDarkMode(dark === 'true');
      if (theme !== null) setColorTheme(theme);
    })();
  }, []);

  const toggleDarkMode = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem('darkMode', String(next));
  };

  const changeTheme = async (t) => {
    setColorTheme(t);
    await AsyncStorage.setItem('colorTheme', t);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colorTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

// Convenience hook (colors only)
export const useThemeColors = () => {
  const { isDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);
  return theme.colors;
};

// Themed primitives (drop-in)
export const ThemedView = ({ style, ...rest }) => {
  const colors = useThemeColors();
  return <View style={[{ backgroundColor: colors.background }, style]} {...rest} />;
};

export const ThemedText = ({ style, ...rest }) => {
  const colors = useThemeColors();
  return <Text style={[{ color: colors.text }, style]} {...rest} />;
};
