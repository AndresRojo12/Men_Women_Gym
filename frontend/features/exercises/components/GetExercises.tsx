import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { api } from '../../auth/services/api';

interface Exercise {
  id: number;
  name: string;
  description: string;
  level: string;
  image: string;
}

function GetExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Exercise[]>('/exercises');
      setExercises(response.data);
    } catch (err: any) {
      console.error(
        'Error fetching exercises:',
        err.response?.data || err.message || err,
      );
      setError('No se pudieron cargar los ejercicios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const renderExercise = ({ item }: { item: Exercise }) => {
    return (
      <Card style={styles.card} key={String(item.id)}>
        <Card.Title title={item.name} subtitle={item.level} />
        <Card.Cover
          source={{ uri: item.image || 'https://picsum.photos/700' }}
          style={{ height: 330 }}
        />
        <Card.Content>
          <Text>{item.description}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => {}}>Ver</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Cargando ejercicios...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && exercises.length === 0 && (
        <Text>No hay ejercicios disponibles.</Text>
      )}
      {!loading && !error && exercises.length > 0 && (
        <FlatList
          data={exercises}
          renderItem={renderExercise}
          keyExtractor={(item) => String(item.id)}
        />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default GetExercises;