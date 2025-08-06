import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    const load = async () => {
      const dark = await AsyncStorage.getItem('darkMode');
      const theme = await AsyncStorage.getItem('colorTheme');
      if (dark !== null) setIsDarkMode(dark === 'true');
      if (theme !== null) setColorTheme(theme);
    };
    load();
  }, []);

  const toggleDarkMode = async () => {
    const val = !isDarkMode;
    setIsDarkMode(val);
    await AsyncStorage.setItem('darkMode', val.toString());
  };

  const changeTheme = async (theme) => {
    setColorTheme(theme);
    await AsyncStorage.setItem('colorTheme', theme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colorTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
