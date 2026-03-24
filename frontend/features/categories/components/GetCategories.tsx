import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { api } from '../../auth/services/api';

interface Category {
  id: number;
  name: string;
  image: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (err: any) {
      console.error(
        'Error fetching categories:',
        err.response?.data || err.message || err,
      );
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => {
    return (
      <Card style={styles.card} key={String(item.id)}>
        <Card.Title title={item.name} />
        <Card.Cover
          source={{ uri: item.image || 'https://picsum.photos/700' }}
          style={{ height: 330 }}
        />
        <Card.Actions>
          <Button onPress={() => {}}>Ver</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Cargando categorías...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && categories.length === 0 && (
        <Text>No hay categorías disponibles.</Text>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCategory}
        numColumns={4}
        columnWrapperStyle={{ justifyContent: 'center', gap: 16 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignSelf: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    margin: 10,
    width: 200,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Categories;
