import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '../../constants/theme';
import 'react-native-gesture-handler';


export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/tabs/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register for Flexify</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => router.push('/auth/login')}>
        Already have an account? <Text style={styles.linkHighlight}>Login</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: FONTS.input,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: FONTS.link,
  },
  linkHighlight: {
    color: COLORS.link,
    fontWeight: '600',
  },
});
