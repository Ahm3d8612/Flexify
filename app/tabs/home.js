// app/home.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { auth } from '../../firebase';
import 'react-native-gesture-handler';

const quotes = [
  "🏋️‍♂️ Push yourself because no one else is going to do it for you.",
  "🔥 Sweat is just fat crying.",
  "💪 Don't limit your challenges, challenge your limits.",
  "🏃‍♂️ The body achieves what the mind believes.",
  "⏱️ It never gets easier, you just get stronger.",
  "🎯 Motivation gets you started. Habit keeps you going.",
];

const tips = [
  "💧 Stay hydrated before, during, and after workouts.",
  "🍎 Eat protein after strength training to help muscle recovery.",
  "⏱️ 20-minute HIIT is great for fat burn and stamina.",
  "🧘 Stretch after workouts to avoid soreness.",
  "🛌 Sleep 7-9 hours for better recovery and gains.",
];

export default function HomeScreen() {
  const user = auth.currentUser;
  const [quote, setQuote] = useState('');
  const [tip, setTip] = useState('');

  useEffect(() => {
    showRandomQuote();
    showRandomTip();
  }, []);

  const showRandomQuote = () => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  };

  const showRandomTip = () => {
    const random = tips[Math.floor(Math.random() * tips.length)];
    setTip(random);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {user?.email ? `Welcome ${user.email} 🎉` : "Welcome to Flexify 🎉"}
      </Text>

      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>{quote}</Text>
        <Button title="New Quote" onPress={showRandomQuote} />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Daily Fitness Tip</Text>
        <Text style={styles.tipText}>{tip}</Text>
        <Button title="Another Tip" onPress={showRandomTip} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📊 Track Your Progress</Text>
        <Text style={styles.infoText}>
          Go to the Routines tab to log and review your workouts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#d0f0c0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    marginTop: 6,
  },
});
