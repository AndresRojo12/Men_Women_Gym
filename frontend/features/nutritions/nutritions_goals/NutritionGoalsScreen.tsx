import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../auth/types/types';
import { api } from '../../auth/services/api';

interface NutritionGoal {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type NutritionGoalsNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  'NutritionGoals'
>;

const NutritionGoalsScreen = () => {
  const navigation = useNavigation<NutritionGoalsNavProp>();
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNutritionGoals = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get<NutritionGoal[]>('/nutritions');
      setNutritionGoals(response.data || []);
    } catch (err) {
      console.error('Error fetching nutrition goals', err);
      setError('No se pudieron cargar las nutrition goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionGoals();
  }, []);

  const renderGoal = ({ item }: { item: NutritionGoal }) => (
    <View style={styles.goalCard}>
      <Text style={styles.goalName}>{item.name}</Text>
      <Text style={styles.goalDescription}>{item.description}</Text>
      <Text style={styles.goalMeta}>
        Creado: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#0b1120', '#111827']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition Goals</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Aquí se muestran todos los objetivos de nutrición.
        </Text>

        {loading ? (
          <Text style={styles.statusText}>Cargando nutrition goals...</Text>
        ) : error ? (
          <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
        ) : nutritionGoals.length === 0 ? (
          <Text style={styles.statusText}>
            No hay nutrition goals disponibles.
          </Text>
        ) : (
          <FlatList
            data={nutritionGoals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGoal}
            contentContainerStyle={styles.list}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 38,
    backgroundColor: '#0b1120',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
  errorText: {
    color: '#f87171',
  },
  list: {
    paddingBottom: 40,
  },
  goalCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  goalName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  goalDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  goalMeta: {
    color: '#94a3b8',
    fontSize: 12,
  },
});

export default NutritionGoalsScreen;
