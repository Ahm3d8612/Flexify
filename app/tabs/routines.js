// ✅ FULL UPDATED CODE
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const COLORS = {
  Strength: '#d1e7dd',
  Cardio: '#fce4ec',
  Core: '#fff3cd',
  Default: '#e0e0e0',
};

export default function RoutinesScreen() {
  const [userId, setUserId] = useState('dummyUserId123');
  const [routines, setRoutines] = useState({});
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState('');
  const [duration, setDuration] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [predefinedExercises, setPredefinedExercises] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const typeEmojis = {
    Strength: '🏋️',
    Cardio: '🏃‍♂️',
    Core: '🧘',
    Default: '📋',
  };

  const getRoutineType = (routineName) => {
    const lower = routineName.toLowerCase();
    if (lower.includes('strength')) return 'Strength';
    if (lower.includes('cardio') || lower.includes('run')) return 'Cardio';
    if (lower.includes('core') || lower.includes('yoga') || lower.includes('stretch')) return 'Core';
    return 'Default';
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid || 'dummyUserId123';
      setUserId(uid);

      const routinesRef = ref(db, `routines/${uid}`);
      onValue(routinesRef, (snapshot) => {
        const data = snapshot.val() || {};
        const grouped = {};
        Object.entries(data).forEach(([key, value]) => {
          const type = getRoutineType(value.name);
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push({ key, ...value });
        });
        setRoutines(grouped);
      });

      const exercisesRef = ref(db, 'predefinedExercises');
      onValue(exercisesRef, (snapshot) => {
        const data = snapshot.val() || {};
        const all = [];
        Object.values(data).forEach((category) => {
          category.forEach((exercise) => {
            all.push(exercise);
          });
        });
        setPredefinedExercises(all);
      });
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAddOrUpdate = () => {
    if (!name || !exercises || !duration) {
      Alert.alert('Please fill all fields');
      return;
    }

    const routineData = { name, exercises, duration: parseInt(duration) };

    if (editingKey) {
      update(ref(db, `routines/${userId}/${editingKey}`), routineData);
    } else {
      push(ref(db, `routines/${userId}`), routineData);
    }

    setName('');
    setExercises('');
    setDuration('');
    setEditingKey(null);
  };

  const handleDelete = (key) => {
    Alert.alert('Delete Routine?', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(ref(db, `routines/${userId}/${key}`)) },
    ]);
  };

  const handleEdit = (routine) => {
    setName(routine.name);
    setExercises(routine.exercises);
    setDuration(String(routine.duration));
    setEditingKey(routine.key);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>📝 Add / Edit Routine</Text>

      <View style={styles.formCard}>
        <TextInput
          placeholder="Routine Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Exercises (comma-separated)"
          value={exercises}
          onChangeText={setExercises}
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (in mins)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title={editingKey ? 'Update Routine' : 'Add Routine'} onPress={handleAddOrUpdate} />
      </View>

      <Text style={styles.subheading}>🧠 Filter Predefined Exercises</Text>
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.label}>Type:</Text>
          <Picker
            selectedValue={selectedType}
            style={styles.picker}
            onValueChange={(val) => setSelectedType(val)}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Strength" value="Strength" />
            <Picker.Item label="Bodyweight" value="Bodyweight" />
            <Picker.Item label="Endurance" value="Endurance" />
          </Picker>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.label}>Equipment:</Text>
          <Picker
            selectedValue={selectedEquipment}
            style={styles.picker}
            onValueChange={(val) => setSelectedEquipment(val)}
          >
            <Picker.Item label="All" value="" />
            <Picker.Item label="Barbell" value="Barbell" />
            <Picker.Item label="None" value="None" />
            <Picker.Item label="Dumbbells" value="Dumbbells" />
          </Picker>
        </View>
      </View>

      <Text style={styles.subheading}>📋 Your Routines</Text>
      {Object.entries(routines).map(([type, routineList]) => (
        <View key={type}>
          <Text style={styles.typeHeading}>{typeEmojis[type]} {type} Routines</Text>
          {routineList.map((item) => (
            <Swipeable
              key={item.key}
              renderRightActions={() => (
                <TouchableOpacity onPress={() => handleDelete(item.key)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={[styles.routineCard, { backgroundColor: COLORS[type] || COLORS.Default }]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.routineName}>{typeEmojis[type]} {item.name}</Text>
                <Text style={styles.detail}>Exercises: {item.exercises}</Text>
                <Text style={styles.detail}>Duration: {item.duration} mins</Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      ))}

      <Text style={styles.subheading}>📚 Matching Predefined Exercises</Text>
      {predefinedExercises
        .filter((ex) => !selectedType || ex.type === selectedType)
        .filter((ex) => !selectedEquipment || ex.equipment === selectedEquipment)
        .map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={{ fontWeight: 'bold' }}>{exercise.name}</Text>
            <Text>Type: {exercise.type}</Text>
            <Text>Equipment: {exercise.equipment}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    paddingBottom: 80,
  },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subheading: { fontSize: 20, fontWeight: '600', marginTop: 30, marginBottom: 10 },
  formCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 30,
    elevation: 2,
  },
  filterRow: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  routineCard: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  routineName: { fontSize: 18, fontWeight: 'bold' },
  detail: { fontSize: 14 },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    marginLeft: 5,
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  typeHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  exerciseCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
});
