
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { useThemeContext } from '../context/ThemeContext';
import getTheme from '../../constants/theme';

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
  const { isDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);

  const [quote, setQuote] = useState('');
  const [tip, setTip] = useState('');
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    showRandomQuote();
    showRandomTip();

    // Load predefined exercises
    const exercisesRef = ref(db, 'predefinedExercises');
    const unsub = onValue(exercisesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setExercises(data);
      setLoading(false);
    });
    return () => unsub();
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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {user?.email ? `Welcome ${user.email} 🎉` : "Welcome to Flexify 🎉"}
      </Text>

      {/* Quote Card */}
      <View style={[styles.quoteCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.quoteText, { color: theme.colors.subtext }]}>{quote}</Text>
        <Button title="New Quote" onPress={showRandomQuote} color={theme.colors.primary} />
      </View>

      {/* Tip Card */}
      <View style={[styles.tipCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.tipTitle, { color: theme.colors.text }]}>💡 Daily Fitness Tip</Text>
        <Text style={[styles.tipText, { color: theme.colors.subtext }]}>{tip}</Text>
        <Button title="Another Tip" onPress={showRandomTip} color={theme.colors.primary} />
      </View>

      {/* Predefined Exercises Section */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        Object.keys(exercises).map((bodyPart) => (
          <View key={bodyPart} style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.bodyPart, { color: theme.colors.primary }]}>{bodyPart}</Text>
            {exercises[bodyPart].map((exercise, index) => (
              <View key={index} style={styles.exerciseBox}>
                <Text style={[styles.exerciseName, { color: theme.colors.text }]}>{exercise.name}</Text>
                <Text style={[styles.exerciseDetail, { color: theme.colors.subtext }]}>
                  Type: {exercise.type}
                </Text>
                <Text style={[styles.exerciseDetail, { color: theme.colors.subtext }]}>
                  Equipment: {exercise.equipment}
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 16, borderRadius: 12, padding: 16, elevation: 3, width: '100%' },
  bodyPart: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  exerciseBox: { marginBottom: 12, paddingLeft: 8 },
  exerciseName: { fontSize: 16, fontWeight: '700' },
  exerciseDetail: { fontSize: 14 },
});
