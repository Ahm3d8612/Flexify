import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';

export default function PredefinedExercises() {
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exercisesRef = ref(db, 'predefinedExercises');
    const unsubscribe = onValue(exercisesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setExercises(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {Object.keys(exercises).map((bodyPart) => (
        <View key={bodyPart} style={styles.card}>
          <Text style={styles.bodyPart}>{bodyPart}</Text>
          {exercises[bodyPart].map((exercise, index) => (
            <View key={index} style={styles.exerciseBox}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>Type: {exercise.type}</Text>
              <Text style={styles.exerciseDetail}>Equipment: {exercise.equipment}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    backgroundColor: '#f2f2f2'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4
  },
  bodyPart: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF'
  },
  exerciseBox: {
    marginBottom: 12,
    paddingLeft: 8
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600'
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#444'
  }
});
