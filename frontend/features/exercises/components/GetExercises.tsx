import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Button, Text, Portal, Modal } from 'react-native-paper';
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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Exercise[]>('/exercises');
      console.log("EJERCICIOS:", response.data);
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

  const openModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const renderExercise = ({ item }: { item: Exercise }) => {
    return (
      <Card style={styles.card} key={String(item.id)}>
        <Card.Title
          title={item.name}
          subtitle={item.level}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Cover
          source={{ uri: item.image || 'https://picsum.photos/700' }}
          style={styles.cardImage}
        />
        <Card.Content style={styles.cardContent}>
          <Text numberOfLines={2} style={styles.cardDescription}>
            {item.description}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => openModal(item)}
            contentStyle={styles.cardButtonContent}
            style={styles.cardButton}
          >
            Ver
          </Button>
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
          numColumns={4}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedExercise && (
            <ScrollView>
              <Card style={styles.modalCard}>
                <Card.Title
                  title={selectedExercise.name}
                  subtitle={selectedExercise.level}
                  titleStyle={styles.modalTitle}
                  subtitleStyle={styles.modalSubtitle}
                />
                <Image
                  source={{
                    uri: selectedExercise.image || 'https://picsum.photos/700',
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Card.Content>
                  <Text style={styles.modalLabel}>Descripción</Text>
                  <Text style={styles.modalText}>{selectedExercise.description}</Text>
                </Card.Content>
                <Card.Actions style={styles.modalActions}>
                  <Button mode="contained" onPress={closeModal}>
                    Cerrar
                  </Button>
                </Card.Actions>
              </Card>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    margin: 10,
    width: 330,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#cbd5e1',
  },
  cardImage: {
    height: 360,
    width: '100%',
  },
  cardContent: {
    paddingVertical: 12,
  },
  cardDescription: {
    color: '#cbd5e1',
    lineHeight: 20,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  cardButton: {
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  cardButtonContent: {
    height: 42,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    maxHeight: '90%',
    width: '90%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  modalCard: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  modalImage: {
    width: '100%',
    height: 360,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '700',
    color: '#222',
  },
  modalTitle: {
    color: '#222',
  },
  modalSubtitle: {
    color: '#222',
  },
  modalText: {
    color: '#222',
  },
  modalActions: {
    justifyContent: 'flex-end',
  },
});

export default GetExercises;