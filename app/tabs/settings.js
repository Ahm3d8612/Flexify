
import React from 'react';
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
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';
import { useThemeContext } from '../context/ThemeContext';
import getTheme from '../../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();

  // keep theme support, but no accent picker UI
  const { isDarkMode, toggleDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);

  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [bmi, setBmi] = React.useState(null);
  const [bmiStatus, setBmiStatus] = React.useState('');

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
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) {
      Alert.alert('Please enter valid height and weight.');
      return;
    }
    const v = (w / (h * h)).toFixed(1);
    setBmi(v);
    setBmiStatus(v < 18.5 ? 'Underweight' : v < 24.9 ? 'Normal' : v < 29.9 ? 'Overweight' : 'Obese');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>⚙️ Settings</Text>

      {/* Dark mode */}
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🌙 Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* BMI */}
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>📏 BMI Calculator</Text>
        <TextInput
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          placeholderTextColor={theme.colors.subtext}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        />
        <TextInput
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholderTextColor={theme.colors.subtext}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        />
        <Button title="Calculate BMI" color={theme.colors.primary} onPress={calculateBMI} />
        {bmi && (
          <Text style={{ marginTop: 10, color: theme.colors.text }}>
            Your BMI is <Text style={{ fontWeight: 'bold' }}>{bmi}</Text> ({bmiStatus})
          </Text>
        )}
      </View>

      {/* Logout */}
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🚪 Logout</Text>
        <Button title="Logout" color={theme.colors.primary} onPress={handleLogout} />
      </View>


      <View style={[styles.card, styles.bottomCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>🗑️ Reset All App Data</Text>
        <Button title="Reset" color="red" onPress={resetAppData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 16, borderRadius: 10, width: '100%', marginBottom: 20, borderWidth: 1 },
  bottomCard: { marginTop: 8, marginBottom: 40 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8, width: '100%' },
});
