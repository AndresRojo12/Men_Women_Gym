import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../../auth/services/api';
import { AuthStackParamList } from '../../auth/types/types';

interface Exercise {
  id: number;
  name: string;
  description: string;
  level: string;
  image: string;
}

interface RoutineExerciseSelection {
  exercise: Exercise;
  sets: string;
  reps: string;
  restTime: string;
  weight: string;
}

const CreateRoutineScreen = () => {
  const navigation = useNavigation<
    NativeStackNavigationProp<AuthStackParamList, 'CreateRoutine'>
  >();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] =
    useState<RoutineExerciseSelection[]>([]);
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setError(null);
    try {
      const response = await api.get<Exercise[]>('/exercises');
      setExercises(response.data);
    } catch (err: any) {
      console.error('Error fetching exercises:', err.response?.data || err.message);
      setError('No se pudieron cargar los ejercicios.');
    }
  };

  const findSelection = (exerciseId: number) =>
    selectedExercises.find((item) => item.exercise.id === exerciseId);

  const toggleExercise = (exercise: Exercise) => {
    const existing = findSelection(exercise.id);

    if (existing) {
      setSelectedExercises((current) =>
        current.filter((item) => item.exercise.id !== exercise.id),
      );
      return;
    }

    setSelectedExercises((current) => [
      ...current,
      {
        exercise,
        sets: '3',
        reps: '10',
        restTime: '60',
        weight: '0',
      },
    ]);
  };

  const updateSelectedExercise = (
    exerciseId: number,
    field: keyof Omit<RoutineExerciseSelection, 'exercise'>,
    value: string,
  ) => {
    setSelectedExercises((current) =>
      current.map((item) =>
        item.exercise.id === exerciseId
          ? { ...item, [field]: value }
          : item,
      ),
    );
  };

  const handleCreateRoutine = async () => {
    setError(null);
    setSuccess(null);

    if (!routineName.trim()) {
      setError('Debes ingresar el nombre de la rutina.');
      return;
    }

    if (!routineDescription.trim()) {
      setError('Debes ingresar la descripción de la rutina.');
      return;
    }

    setLoading(true);

    try {
      const routineResponse = await api.post('/routines', {
        name: routineName.trim(),
        description: routineDescription.trim(),
      });

      const routineId = routineResponse.data.id;

      if (selectedExercises.length > 0) {
        await Promise.all(
          selectedExercises.map((selection) =>
            api.post('/routine-exercises', {
              routineId,
              exerciseId: selection.exercise.id,
              sets: Number(selection.sets),
              reps: Number(selection.reps),
              restTime: Number(selection.restTime),
              weight: Number(selection.weight),
            }),
          ),
        );
      }

      setSuccess('Rutina creada con éxito.');
      setRoutineName('');
      setRoutineDescription('');
      setSelectedExercises([]);
      navigation.navigate('Routines');
    } catch (err: any) {
      console.error('Error creating routine:', err.response?.data || err.message);
      if (err.response?.data?.message) {
        setError(String(err.response.data.message));
      } else {
        setError('No se pudo crear la rutina. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const buildExerciseImageUri = (image?: string | null) => {
    if (!image) return 'https://picsum.photos/300';
    if (/^https?:\/\//.test(image)) return image;
    const baseUrl = String(api.defaults.baseURL || 'http://localhost:3000').replace(/\/$/, '');
    return `${baseUrl}/${image.replace(/^\//, '')}`;
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const selected = Boolean(findSelection(item.id));

    return (
      <Card style={styles.exerciseCard} key={String(item.id)}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => toggleExercise(item)}>
          <Image
            source={{ uri: buildExerciseImageUri(item.image) }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Card.Content>
          <Text numberOfLines={1} style={styles.exerciseTitle}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.exerciseSubtitle}>
            {item.level}
          </Text>
          <Text numberOfLines={2} style={styles.exerciseDescription}>
            {item.description}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.exerciseActions}>
          <Button
            mode={selected ? 'contained-tonal' : 'contained'}
            onPress={() => toggleExercise(item)}
            textColor={selected ? '#fff' : '#0f172a'}
            style={styles.exerciseButton}
          >
            {selected ? 'Remover' : 'Agregar'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="headlineSmall" style={styles.title}>
          Crear nueva rutina
        </Text>
        <Button mode="text" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Nombre de la rutina</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={routineName}
            onChangeText={setRoutineName}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción breve"
            value={routineDescription}
            onChangeText={setRoutineDescription}
            multiline
          />
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ejercicios disponibles</Text>
        {loading && <Text>Cargando ejercicios...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading && !error && exercises.length === 0 && (
          <Text>No hay ejercicios cargados en el sistema.</Text>
        )}
        {!loading && exercises.length > 0 && (
          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => String(item.id)}
            numColumns={4}
            contentContainerStyle={styles.exerciseList}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {selectedExercises.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios seleccionados</Text>
          {selectedExercises.map((selection) => (
            <Card style={styles.selectedCard} key={String(selection.exercise.id)}>
              <Card.Title
                title={selection.exercise.name}
                subtitle="Configura series y repeticiones"
                titleStyle={styles.selectedTitle}
              />
              <Card.Content>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Series</Text>
                    <TextInput
                      style={styles.smallInput}
                      value={selection.sets}
                      onChangeText={(text) =>
                        updateSelectedExercise(selection.exercise.id, 'sets', text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Reps</Text>
                    <TextInput
                      style={styles.smallInput}
                      value={selection.reps}
                      onChangeText={(text) =>
                        updateSelectedExercise(selection.exercise.id, 'reps', text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Descanso (seg)</Text>
                    <TextInput
                      style={styles.smallInput}
                      value={selection.restTime}
                      onChangeText={(text) =>
                        updateSelectedExercise(selection.exercise.id, 'restTime', text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Peso (kg)</Text>
                    <TextInput
                      style={styles.smallInput}
                      value={selection.weight}
                      onChangeText={(text) =>
                        updateSelectedExercise(selection.exercise.id, 'weight', text)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.footer}> 
        <Button
          mode="contained"
          onPress={handleCreateRoutine}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          textColor="#0f172a"
        >
          Crear rutina
        </Button>
        {success ? <Text style={styles.success}>{success}</Text> : null}
      </View>
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
  card: {
    borderRadius: 20,
    backgroundColor: '#111827',
    marginBottom: 20,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 6,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  exerciseList: {
    paddingBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    marginBottom: 16,
    marginRight: 12,
    width: '23%',
    minWidth: 180,
    overflow: 'hidden',
  },
  exerciseTitle: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  exerciseSubtitle: {
    color: '#94a3b8',
  },
  exerciseDescription: {
    color: '#cbd5e1',
    marginTop: 8,
    fontSize: 12,
  },
  exerciseImage: {
    width: '100%',
    height: 160,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  exerciseButton: {
    borderRadius: 999,
    minWidth: 110,
  },
  selectedCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#111827',
  },
  selectedTitle: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
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
  footer: {
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: '#38bdf8',
  },
  error: {
    color: '#f87171',
    marginBottom: 12,
  },
  success: {
    marginTop: 12,
    color: '#22c55e',
    fontWeight: '700',
  },
});

export default CreateRoutineScreen;
