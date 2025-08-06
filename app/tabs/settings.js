import React from 'react';
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
import { useThemeContext } from '../context/ThemeContext';
import getTheme from '../../constants/theme';

export default function SettingsScreen() {
  const {
    isDarkMode,
    toggleDarkMode,
    colorTheme,
    changeTheme,
  } = useThemeContext();

  const theme = getTheme(colorTheme, isDarkMode);

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
          toggleDarkMode(false);
          changeTheme('blue');
          Alert.alert('Data reset successfully');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>⚙️ Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🎨 Theme Color</Text>
        <View style={styles.colorRow}>
          {['blue', 'green', 'purple', 'orange'].map((themeKey) => (
            <Button
              key={themeKey}
              title={themeKey}
              color={themeKey === colorTheme ? getTheme(themeKey, isDarkMode).colors.primary : '#ccc'}
              onPress={() => changeTheme(themeKey)}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🧹 Reset App Data</Text>
        <Button title="Reset All" color={theme.colors.error} onPress={resetData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
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
