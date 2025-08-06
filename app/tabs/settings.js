// app/tabs/settings.js
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    // Here, you could store this preference in AsyncStorage or Context
  };

  const resetAppData = async () => {
    Alert.alert('Reset App', 'Are you sure you want to reset all app data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          Alert.alert('Data Cleared', 'App data has been reset.');
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🗑️ Reset All App Data</Text>
        <Button title="Reset" color="red" onPress={resetAppData} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🚪 Logout</Text>
        <Button title="Logout" color="#007bff" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
