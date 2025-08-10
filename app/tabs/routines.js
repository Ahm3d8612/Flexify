
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

import { useThemeContext } from '../context/ThemeContext';
import getTheme from '../../constants/theme';

const CHIP_COLORS = {
  Strength: '#3ddc9740',
  Cardio:   '#ff6ea840',
  Core:     '#ffd16640',
  Default:  '#99999940',
};

const EMOJI = { Strength: '🏋️', Cardio: '🏃‍♂️', Core: '🧘', Default: '📋' };

const getRoutineType = (name = '') => {
  const lower = String(name).toLowerCase();
  if (lower.includes('strength')) return 'Strength';
  if (lower.includes('cardio') || lower.includes('run')) return 'Cardio';
  if (lower.includes('core') || lower.includes('yoga') || lower.includes('stretch')) return 'Core';
  return 'Default';
};

export default function RoutinesScreen() {
  const { isDarkMode, colorTheme } = useThemeContext();
  const theme = getTheme(colorTheme, isDarkMode);
  
  const [userId, setUserId] = useState('dummyUserId123'); // fallback for demo
  const [groups, setGroups] = useState({});
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState('');
  const [duration, setDuration] = useState('');
  const [editingKey, setEditingKey] = useState(null);

  const [predefined, setPredefined] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [equipFilter, setEquipFilter] = useState('');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      const uid = user?.uid || 'dummyUserId123';
      setUserId(uid);

      const routinesRef = ref(db, `routines/${uid}`);
      onValue(routinesRef, (snap) => {
        const data = snap.val() || {};
        const grouped = {};
        Object.entries(data).forEach(([key, value]) => {
          const t = getRoutineType(value?.name);
          if (!grouped[t]) grouped[t] = [];
          grouped[t].push({ key, ...value });
        });
        setGroups(grouped);
      });

      const exRef = ref(db, 'predefinedExercises');
      onValue(exRef, (snap) => {
        const d = snap.val() || {};
        const all = [];
        Object.values(d).forEach((arr) => arr.forEach((e) => all.push(e)));
        setPredefined(all);
      });
    });

    return () => unsubAuth();
  }, []);

  const addOrUpdate = () => {
    if (!name || !exercises || !duration) {
      Alert.alert('Missing info', 'Please fill all fields.');
      return;
    }
    const data = { name, exercises, duration: parseInt(duration, 10) || 0 };
    if (editingKey) {
      update(ref(db, `routines/${userId}/${editingKey}`), data);
    } else {
      push(ref(db, `routines/${userId}`), data);
    }
    setName(''); setExercises(''); setDuration(''); setEditingKey(null);
  };

  const confirmDelete = (key) =>
    Alert.alert('Delete Routine?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(ref(db, `routines/${userId}/${key}`)) },
    ]);

  const startEdit = (r) => {
    setName(r.name); setExercises(r.exercises); setDuration(String(r.duration)); setEditingKey(r.key);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>📝 Add / Edit Routine</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TextInput
          placeholder="Routine Name"
          placeholderTextColor={theme.colors.subtext}
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        />
        <TextInput
          placeholder="Exercises (comma-separated)"
          placeholderTextColor={theme.colors.subtext}
          value={exercises}
          onChangeText={setExercises}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        />
        <TextInput
          placeholder="Duration (in mins)"
          placeholderTextColor={theme.colors.subtext}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        />
        <Button title={editingKey ? 'Update Routine' : 'Add Routine'} onPress={addOrUpdate} color={theme.colors.primary} />
      </View>

      <Text style={[styles.subheading, { color: theme.colors.text }]}>🧠 Filter Predefined Exercises</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Type</Text>
        <Picker
          selectedValue={typeFilter}
          onValueChange={setTypeFilter}
          style={[styles.picker, { color: theme.colors.text }]}
          dropdownIconColor={theme.colors.text}
        >
          <Picker.Item label="All" value="" />
          <Picker.Item label="Strength" value="Strength" />
          <Picker.Item label="Bodyweight" value="Bodyweight" />
          <Picker.Item label="Endurance" value="Endurance" />
        </Picker>

        <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>Equipment</Text>
        <Picker
          selectedValue={equipFilter}
          onValueChange={setEquipFilter}
          style={[styles.picker, { color: theme.colors.text }]}
          dropdownIconColor={theme.colors.text}
        >
          <Picker.Item label="All" value="" />
          <Picker.Item label="Barbell" value="Barbell" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Dumbbells" value="Dumbbells" />
        </Picker>
      </View>

      <Text style={[styles.subheading, { color: theme.colors.text }]}>📋 Your Routines</Text>
      {Object.entries(groups).map(([type, list]) => (
        <View key={type}>
          <Text style={[styles.typeHeader, { color: theme.colors.text }]}>
          </Text>
          {list.map((item) => (
            <Swipeable
              key={item.key}
              renderRightActions={() => (
                <TouchableOpacity onPress={() => confirmDelete(item.key)} style={styles.deleteBtn}>
                  <Text style={styles.deleteTxt}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                onPress={() => startEdit(item)}
                style={[
                  styles.routineCard,
                  { backgroundColor: CHIP_COLORS[type] || CHIP_COLORS.Default, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.routineTitle, { color: theme.colors.text }]}>
                  {EMOJI[type]} {item.name}
                </Text>
                <Text style={{ color: theme.colors.subtext }}>Exercises: {item.exercises}</Text>
                <Text style={{ color: theme.colors.subtext }}>Duration: {item.duration} mins</Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </View>
      ))}

      <Text style={[styles.subheading, { color: theme.colors.text, marginTop: 24 }]}>
        📚 Matching Predefined Exercises
      </Text>
      {predefined
        .filter((ex) => !typeFilter || ex.type === typeFilter)
        .filter((ex) => !equipFilter || ex.equipment === equipFilter)
        .map((ex, i) => (
          <View key={i} style={[styles.exerciseCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{ex.name}</Text>
            <Text style={{ color: theme.colors.subtext }}>Type: {ex.type}</Text>
            <Text style={{ color: theme.colors.subtext }}>Equipment: {ex.equipment}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  heading: { fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  subheading: { fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 8 },
  card: { borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, elevation: 2 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 16 },
  picker: { backgroundColor: 'transparent' },
  typeHeader: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  routineCard: { borderWidth: 1, padding: 12, borderRadius: 12, marginBottom: 10 },
  routineTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  deleteBtn: { backgroundColor: '#ff3b30', justifyContent: 'center', paddingHorizontal: 22, marginLeft: 6, borderRadius: 10 },
  deleteTxt: { color: '#fff', fontWeight: '700' },
  exerciseCard: { padding: 12, borderRadius: 12, marginBottom: 10, elevation: 1, borderWidth: 1 },
});
