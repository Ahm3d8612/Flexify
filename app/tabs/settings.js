import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    const loadPreferences = async () => {
      const darkMode = await AsyncStorage.getItem('darkMode');
      const theme = await AsyncStorage.getItem('colorTheme');
      if (darkMode !== null) setIsDarkMode(darkMode === 'true');
      if (theme !== null) setColorTheme(theme);
    };
    loadPreferences();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', newValue.toString());
  };

  const changeTheme = async (theme) => {
    setColorTheme(theme);
    await AsyncStorage.setItem('colorTheme', theme);
  };

  const resetData = () => {
    Alert.alert('Reset All Data', 'Are you sure you want to reset everything?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setIsDarkMode(false);
          setColorTheme('blue');
          Alert.alert('Data reset successfully');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>⚙️ Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🎨 Theme Color</Text>
        <View style={styles.colorRow}>
          {['blue', 'green', 'purple', 'orange'].map((theme) => (
            <Button
              key={theme}
              title={theme}
              color={theme === colorTheme ? theme : '#ccc'}
              onPress={() => changeTheme(theme)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🧹 Reset App Data</Text>
        <Button title="Reset All" color="red" onPress={resetData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});