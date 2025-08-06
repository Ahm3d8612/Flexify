import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
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
    // Store in AsyncStorage or global context if needed
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

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) {
      Alert.alert('Please enter valid height and weight.');
      return;
    }
    const bmiValue = (w / (h * h)).toFixed(1);
    setBmi(bmiValue);

    let status = '';
    if (bmiValue < 18.5) status = 'Underweight';
    else if (bmiValue < 24.9) status = 'Normal';
    else if (bmiValue < 29.9) status = 'Overweight';
    else status = 'Obese';

    setBmiStatus(status);
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

      <View style={styles.card}>
        <Text style={styles.label}>📏 BMI Calculator</Text>
        <TextInput
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
          placeholderTextColor="#999"
        />
        <Button title="Calculate BMI" onPress={calculateBMI} />
        {bmi && (
          <Text style={{ marginTop: 10 }}>
            Your BMI is <Text style={{ fontWeight: 'bold' }}>{bmi}</Text> ({bmiStatus})
          </Text>
        )}
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
  },
});
