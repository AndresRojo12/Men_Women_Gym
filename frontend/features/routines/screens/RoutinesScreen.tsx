import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../auth/types/types';
import { api } from '../../auth/services/api';

interface RoutineExercise {
  id: number;
  sets: number;
  reps: number;
  restTime: number;
  weight: number;
  exercise: {
    id: number;
    name: string;
    description: string;
    level: string;
    image: string;
  };
}

interface Routine {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  routineExercises: RoutineExercise[];
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  level: string;
  image: string;
}

const RoutinesScreen = () => {
  const navigation = useNavigation<
    NativeStackNavigationProp<AuthStackParamList, 'Routines'>
  >();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [restTime, setRestTime] = useState('60');
  const [weight, setWeight] = useState('0');
  const [addingExercise, setAddingExercise] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutines();
    fetchExercises();
  }, []);

  const fetchRoutines = async () => {
    setLoading(true);
    setError(null);
    setActionMessage(null);

    try {
      const response = await api.get<Routine[]>('/routines');
      setRoutines(response.data);
    } catch (err: any) {
      console.error('Error loading rutinas:', err.response?.data || err.message);
      setError('No se pudo cargar las rutinas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await api.get<Exercise[]>('/exercises');
      setAvailableExercises(response.data);
    } catch (err: any) {
      console.error('Error fetching exercises:', err.response?.data || err.message);
    }
  };

  const addExerciseToRoutine = async () => {
    if (!selectedRoutineId) {
      setError('Selecciona una rutina primero.');
      return;
    }

    if (!selectedExerciseId) {
      setError('Selecciona un ejercicio para agregar.');
      return;
    }

    if (!sets.trim() || !reps.trim()) {
      setError('Debes completar series y repeticiones.');
      return;
    }

    setLoading(true);
    setError(null);
    setActionMessage(null);

    try {
      await api.post('/routine-exercises', {
        routineId: selectedRoutineId,
        exerciseId: selectedExerciseId,
        sets: Number(sets),
        reps: Number(reps),
        restTime: Number(restTime),
        weight: Number(weight),
      });

      setActionMessage('Ejercicio agregado correctamente.');
      setSelectedExerciseId(null);
      setSets('3');
      setReps('10');
      setRestTime('60');
      setWeight('0');
      setAddingExercise(false);
      await fetchRoutines();
    } catch (err: any) {
      console.error('Error agregando ejercicio:', err.response?.data || err.message);
      setError('No se pudo agregar el ejercicio.');
    } finally {
      setLoading(false);
    }
  };

  const selectedExercise = availableExercises.find(
    (exercise) => exercise.id === selectedExerciseId,
  );

  const buildExerciseImageUri = (image?: string | null) => {
    if (!image) return 'https://picsum.photos/300';
    if (/^https?:\/\//.test(image)) return image;
    const baseUrl = String(api.defaults.baseURL || 'http://localhost:3000').replace(/\/$/, '');
    return `${baseUrl}/${image.replace(/^\//, '')}`;
  };

  const selectedRoutine = routines.find(
    (item) => item.id === selectedRoutineId,
  ) || null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Button
          mode="text"
          textColor="#38bdf8"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          style={styles.backLink}
        >
          Volver
        </Button>
        <Text variant="headlineSmall" style={styles.title}>
          Mis rutinas
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('CreateRoutine')}>
          Nueva rutina
        </Button>
      </View>

      {loading && <Text style={styles.infoText}>Cargando mis rutinas...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && routines.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.infoText}>Aún no tienes rutinas creadas.</Text>
          <Button mode="outlined" onPress={() => navigation.navigate('CreateRoutine')}>
            Crear primera rutina
          </Button>
        </View>
      )}

      {!loading && routines.length > 0 && (
        <FlatList
          numColumns={4}
          data={routines}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.routineList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('RoutineDetail', { routineId: item.id })}
            >
              <Card style={styles.card}>
                <Card.Title
                  title={item.name}
                  subtitle={item.description}
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardSubtitle}
                />
                <Card.Content>
                  <Text style={styles.infoText}>
                    Toca la tarjeta para ver los ejercicios de esta rutina.
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedRoutine && (
        <Card style={styles.card}>
          <Card.Title
            title={`Rutina seleccionada: ${selectedRoutine.name}`}
            subtitle="Puedes agregar ejercicios a esta rutina"
            titleStyle={styles.cardTitle}
            subtitleStyle={styles.cardSubtitle}
          />
          <Card.Content>
            <Text style={styles.infoText}>{selectedRoutine.description}</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button onPress={() => setAddingExercise((current) => !current)}>
              {addingExercise ? 'Cancelar' : 'Agregar ejercicio'}
            </Button>
          </Card.Actions>
        </Card>
      )}

      {addingExercise && selectedRoutine && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={[styles.label, styles.addLabel]}>Agregar nuevo ejercicio</Text>
            {availableExercises.length === 0 ? (
              <Text style={styles.infoText}>No hay ejercicios disponibles.</Text>
            ) : (
              <FlatList
                data={availableExercises}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.exerciseList}
                showsVerticalScrollIndicator={false}
                numColumns={4}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                  <Card
                    style={[
                      styles.availableExerciseCard,
                      selectedExerciseId === item.id && styles.selectedExerciseCard,
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectedExerciseId(item.id)}
                    >
                      <Image
                        source={{ uri: buildExerciseImageUri(item.image) }}
                        style={styles.availableCardImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <Card.Content>
                      <Text style={styles.exerciseTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.exerciseSubtitle} numberOfLines={1}>
                        {item.level}
                      </Text>
                      <Text style={styles.exerciseDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </Card.Content>
                    <Card.Actions style={styles.cardActions}>
                      <Button
                        mode={selectedExerciseId === item.id ? 'contained' : 'outlined'}
                        onPress={() => setSelectedExerciseId(item.id)}
                        textColor={selectedExerciseId === item.id ? '#fff' : '#f8fafc'}
                      >
                        {selectedExerciseId === item.id ? 'Seleccionado' : 'Seleccionar'}
                      </Button>
                    </Card.Actions>
                  </Card>
                )}
              />
            )}

            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Series</Text>
                <TextInput
                  style={styles.smallInput}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.smallInput}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.fieldRow}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Descanso (seg)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={restTime}
                  onChangeText={setRestTime}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {selectedExercise && (
              <Text style={styles.infoText}>
                Ejercicio seleccionado: {selectedExercise.name}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={addExerciseToRoutine}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              textColor="#0f172a"
            >
              Agregar ejercicio
            </Button>
            {actionMessage ? <Text style={styles.success}>{actionMessage}</Text> : null}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#0b1120',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#f8fafc',
  },
  infoText: {
    color: '#cbd5e1',
    marginBottom: 14,
  },
  error: {
    color: '#f87171',
    marginBottom: 16,
  },
  emptyState: {
    padding: 18,
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  routineList: {
    paddingBottom: 16,
  },
  selectedRoutineCard: {
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  routineExerciseCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    marginBottom: 10,
    flex: 1,
    margin: 4,
    overflow: 'hidden',
  },
  backLink: {
    marginRight: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingVertical: 8,
    marginBottom: 16,
    margin:50

  },
  cardTitle: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#94a3b8',
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 10,
    fontWeight: '700',
  },
  exerciseCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    marginTop: 10,
  },
  availableExerciseCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    marginBottom: 12,
    width: '23%',
    minWidth: 170,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  availableCardImage: {
    width: '100%',
    height: 180,
  },
  exerciseDescription: {
    color: '#cbd5e1',
    marginTop: 4,
    fontSize: 12,
  },
  selectedExerciseCard: {
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  exerciseTitle: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  exerciseSubtitle: {
    color: '#cbd5e1',
  },
  exerciseText: {
    color: '#cbd5e1',
    marginTop: 6,
  },
  addLabel: {
    marginBottom: 12,
  },
  exerciseList: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  fieldGroup: {
    flex: 1,
  },
  smallInput: {
    backgroundColor: '#1f2937',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  submitButton: {
    borderRadius: 999,
    paddingVertical: 10,
    marginTop: 12,
    backgroundColor: '#38bdf8',
  },
  success: {
    marginTop: 12,
    color: '#22c55e',
    fontWeight: '700',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
});

export default RoutinesScreen;
