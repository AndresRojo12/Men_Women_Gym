import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

interface Exercise {
  id: number;
  name: string;
  description: string;
  level: string;
  image: string;
}

interface Routine {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  routineExercises: RoutineExercise[];
}

type Props = NativeStackScreenProps<AuthStackParamList, 'RoutineDetail'>;

const RoutineDetailScreen = ({ route, navigation }: Props) => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [restTime, setRestTime] = useState('60');
  const [weight, setWeight] = useState('0');
  const [addingExercise, setAddingExercise] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const routineId = route.params.routineId;

  useEffect(() => {
    const loadRoutine = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Routine>(`/routines/${routineId}`);
        setRoutine(response.data);
      } catch (err: any) {
        console.error('Error loading routine detail:', err?.response?.data || err?.message);
        setError('No se pudo cargar los detalles de la rutina.');
      } finally {
        setLoading(false);
      }
    };

    const fetchExercises = async () => {
      try {
        const response = await api.get<Exercise[]>('/exercises');
        setAvailableExercises(response.data);
      } catch (err: any) {
        console.error('Error loading available exercises:', err?.response?.data || err?.message);
      }
    };

    loadRoutine();
    fetchExercises();
  }, [routineId]);

  const selectedExercises = availableExercises.filter((exercise) => selectedExerciseIds.includes(exercise.id));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const stopWorkout = () => {
    setWorkoutActive(false);
    setRestRemaining(null);
    setIsResting(false);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setWorkoutElapsed(0);
  };

  const startWorkout = () => {
    setWorkoutActive(true);
    setWorkoutElapsed(0);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setIsResting(false);
    setRestRemaining(null);
  };

  const advanceAfterRest = () => {
    const exercise = routineExercises[currentExerciseIndex];
    const nextSet = currentSet + 1;

    if (nextSet <= exercise.sets) {
      setCurrentSet(nextSet);
      setIsResting(false);
      setRestRemaining(null);
      return;
    }

    if (currentExerciseIndex < routineExercises.length - 1) {
      setCurrentExerciseIndex((current) => current + 1);
      setCurrentSet(1);
      setIsResting(false);
      setRestRemaining(null);
      return;
    }

    stopWorkout();
  };

  const startRest = () => {
    const exercise = routineExercises[currentExerciseIndex];
    const rest = exercise.restTime ?? 60;
    setIsResting(true);
    setRestRemaining(rest);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (workoutActive) {
      timer = setInterval(() => {
        setWorkoutElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [workoutActive]);

  useEffect(() => {
    let restTimer: ReturnType<typeof setInterval> | null = null;
    if (isResting && restRemaining !== null && restRemaining > 0) {
      restTimer = setInterval(() => {
        setRestRemaining((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    }
    return () => {
      if (restTimer) clearInterval(restTimer);
    };
  }, [isResting, restRemaining]);

  useEffect(() => {
    if (isResting && restRemaining === 0) {
      advanceAfterRest();
    }
  }, [restRemaining, isResting]);

  const addExerciseToRoutine = async () => {
    if (!selectedExerciseIds.length) {
      setError('Selecciona al menos un ejercicio primero.');
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
      await Promise.all(
        selectedExerciseIds.map((exerciseId) =>
          api.post('/routine-exercises', {
            routineId,
            exerciseId,
            sets: Number(sets),
            reps: Number(reps),
            restTime: Number(restTime),
            weight: Number(weight),
          })
        )
      );

      setActionMessage(`Ejercicios agregados correctamente (${selectedExerciseIds.length}).`);
      setSelectedExerciseIds([]);
      setSets('3');
      setReps('10');
      setRestTime('60');
      setWeight('0');
      setAddingExercise(false);
      const response = await api.get<Routine>(`/routines/${routineId}`);
      setRoutine(response.data);
    } catch (err: any) {
      console.error('Error agregando ejercicio:', err?.response?.data || err?.message);
      setError('No se pudo agregar el ejercicio.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.infoText}>Cargando rutina...</Text>
      </View>
    );
  }

  if (error || !routine) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.infoText}>{error ?? 'No se encontró la rutina seleccionada.'}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </View>
    );
  }

  const buildExerciseImageUri = (image?: string | null) => {
    if (!image) return 'https://picsum.photos/200';
    if (/^https?:\/\//.test(image)) return image;
    const baseUrl = String(api.defaults.baseURL || 'http://localhost:3000').replace(/\/$/, '');
    return `${baseUrl}/${image.replace(/^\//, '')}`;
  };

  const routineExercises = routine.routineExercises ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Button icon="arrow-left" mode="text" onPress={() => navigation.goBack()}>
          Volver
        </Button>
        <Text variant="headlineSmall" style={styles.title}>
          {routine.name}
        </Text>
      </View>

      <Text style={styles.subtitle}>{routine.description}</Text>
      <Card style={styles.workoutCard}>
        <Card.Content>
          <Text style={styles.label}>Entrenamiento</Text>
          <Text style={styles.infoText}>
            {workoutActive ? 'Entrenamiento en curso' : 'Comienza tu rutina para iniciar el cronómetro'}
          </Text>
          <View style={styles.workoutMetrics}>
            <Text style={styles.metricLabel}>Tiempo total entrenado</Text>
            <Text style={styles.metricValue}>{formatTime(workoutElapsed)}</Text>
          </View>
          {workoutActive && (
            <View style={styles.workoutMetrics}>
              <Text style={styles.metricLabel}>Ejercicio actual</Text>
              <Text style={styles.metricValue}>
                {routineExercises[currentExerciseIndex]?.exercise.name ?? 'Finalizado'}
              </Text>
            </View>
          )}
          {isResting && restRemaining !== null ? (
            <Text style={styles.restText}>Descanso: {restRemaining}s</Text>
          ) : workoutActive ? (
            <Text style={styles.restText}>
              Serie {currentSet} / {routineExercises[currentExerciseIndex]?.sets ?? 0}
            </Text>
          ) : null}
<View style={styles.actionButtonsRow}>
            <Button
              mode={workoutActive ? 'outlined' : 'contained'}
              compact
              onPress={workoutActive ? stopWorkout : startWorkout}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              labelStyle={styles.actionButtonLabel}
            >
              {workoutActive ? 'Terminar entrenamiento' : 'Comenzar entrenamiento'}
            </Button>
            <Button
              mode={addingExercise ? 'outlined' : 'contained'}
              compact
              onPress={() => {
                setAddingExercise((current) => !current);
                setActionMessage(null);
                setError(null);
              }}
              style={[styles.actionButton, styles.addExerciseButton]}
              contentStyle={styles.actionButtonContent}
              labelStyle={styles.actionButtonLabel}
            >
              {addingExercise ? 'Cancelar' : 'Agregar ejercicio'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {addingExercise && (
        <Card style={styles.cardSection}>
          <Card.Content>
            <Text style={[styles.label, styles.addLabel]}>Selecciona un ejercicio</Text>
            <FlatList
              data={availableExercises}
              keyExtractor={(item) => String(item.id)}
              numColumns={4}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.availableExerciseList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedExerciseIds((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id]
                    );
                  }}
                >
                  <Card
                    style={[
                      styles.availableExerciseCard,
                      selectedExerciseIds.includes(item.id) && styles.selectedExerciseCard,
                    ]}
                  >
                    <Image
                      source={{ uri: buildExerciseImageUri(item.image) }}
                      style={styles.availableCardImage}
                      resizeMode="cover"
                    />
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
                  </Card>
                </TouchableOpacity>
              )}
            />

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
                <Text style={styles.label}>Descanso</Text>
                <TextInput
                  style={styles.smallInput}
                  value={restTime}
                  onChangeText={setRestTime}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Peso</Text>
                <TextInput
                  style={styles.smallInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {selectedExercises.length > 0 && (
              <Text style={styles.infoText}>
                Ejercicios seleccionados: {selectedExercises.map((exercise) => exercise.name).join(', ')}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={addExerciseToRoutine}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            >
              Agregar a la rutina
            </Button>
            {actionMessage ? <Text style={styles.success}>{actionMessage}</Text> : null}
          </Card.Content>
        </Card>
      )}

      {routineExercises.length === 0 ? (
        <Text style={styles.infoText}>No hay ejercicios agregados aún.</Text>
      ) : (
        <FlatList
          data={routineExercises}
          keyExtractor={(item) => String(item.id)}
          numColumns={4}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.exerciseList}
          renderItem={({ item, index }) => {
            const isCurrentExercise = workoutActive && index === currentExerciseIndex;
            const isCompletedExercise = workoutActive && index < currentExerciseIndex;

            return (
              <Card style={styles.exerciseCard}>
                <Image
                  source={{ uri: buildExerciseImageUri(item.exercise.image) }}
                  style={styles.exerciseImage}
                  resizeMode="cover"
                />
                <Card.Content>
                  <Text style={styles.exerciseTitle}>{item.exercise.name}</Text>
                  <Text style={styles.exerciseSubtitle}>{item.exercise.level}</Text>
                  <Text style={styles.exerciseText}>
                    {item.sets} series x {item.reps} repeticiones
                  </Text>
                  <Text style={styles.exerciseText}>
                    Descanso: {item.restTime ?? 0}s • Peso: {item.weight ?? 0}kg
                  </Text>
                  {isCompletedExercise && (
                    <Text style={styles.completedText}>Ejercicio completado</Text>
                  )}
                  {isCurrentExercise && !isResting && workoutActive && (
                    <View style={styles.exerciseStatusRow}>
                      <Text style={styles.exerciseStatusText}>
                        Serie actual {currentSet} / {item.sets}
                      </Text>
                      <Button
                        mode="contained"
                        compact
                        onPress={startRest}
                        style={styles.exerciseActionButton}
                      >
                        Terminé serie
                      </Button>
                    </View>
                  )}
                  {isCurrentExercise && isResting && (
                    <Text style={styles.restTimerText}>
                      Descanso: {restRemaining ?? 0}s
                    </Text>
                  )}
                </Card.Content>
              </Card>
            );
          }}
        />
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    color: '#f8fafc',
    flex: 1,
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0b1120',
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 10,
    fontWeight: '700',
  },
  infoText: {
    color: '#cbd5e1',
    marginBottom: 14,
  },
  exerciseList: {
    paddingBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    width: '23%',
    minWidth: 300,
  },
  exerciseImage: {
    width: '100%',
    height: 220,
  },
  exerciseTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    marginBottom: 6,
  },
  exerciseSubtitle: {
    color: '#94a3b8',
    marginBottom: 6,
  },
  exerciseDescription: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 8,
  },
  exerciseText: {
    color: '#cbd5e1',
    marginBottom: 4,
  },
  addButton: {
    marginBottom: 16,
  },
  cardSection: {
    backgroundColor: '#111827',
    borderRadius: 18,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  addLabel: {
    marginBottom: 12,
  },
  availableExerciseList: {
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  availableExerciseCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    width: 300,
    height: 360,
    overflow: 'hidden',
  },
  selectedExerciseCard: {
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  availableCardImage: {
    width: '100%',
    height: 220,
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
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    minHeight: 38,
  },
  actionButtonContent: {
    height: 38,
    paddingHorizontal: 14,
  },
  actionButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  addExerciseButton: {
    borderColor: '#38bdf8',
    marginLeft: 10,
  },
  smallInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  submitButton: {
    marginTop: 16,
  },
  success: {
    color: '#86efac',
    marginTop: 10,
  },
});

export default RoutineDetailScreen;
