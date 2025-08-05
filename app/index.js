// app/index.js
import { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { auth } from '../firebase';
import 'react-native-gesture-handler';


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.replace('/tabs/home');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Flexify 💪</Text>
      <Link href="/auth/login" asChild>
        <Button title="Login" />
      </Link>
      <Link href="/auth/register" asChild>
        <Button title="Register" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5fcff' },
  title: { fontSize: 26, marginBottom: 20, fontWeight: 'bold', color: '#333' }
});
