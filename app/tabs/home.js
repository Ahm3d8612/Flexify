// app/home.js
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';
import 'react-native-gesture-handler';


export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user?.email ? `Welcome ${user.email} 🎉` : "Welcome to Flexify 🎉"}
      </Text>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});
