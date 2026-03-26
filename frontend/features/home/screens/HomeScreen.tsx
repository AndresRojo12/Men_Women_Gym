import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../auth/types/types';
import MainHeader from '../../common/components/MainHeader';
import {
  Text,
  Button,
  Card,
  ProgressBar,
} from 'react-native-paper';

// import traer perfil de usuario para mostrar en el header, por ahora es estático
import React, { useState, useEffect } from 'react';
import { api } from '../../auth/services/api';

interface UserProfile {
  id: number;
  name: string;
}

const HomeScreen = () => {
  type HomeNavProp = NativeStackNavigationProp<AuthStackParamList, 'Home'>;
  const navigation = useNavigation<HomeNavProp>();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<UserProfile>('/customers/me');
      setUserProfile(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <LinearGradient
      colors={['#000000', '#374151']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* CONTROLES SUPERIORES */}
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
        </View>

        <MainHeader
          userName={userProfile?.name}
        />

        {/* ESTADISTICAS */}
        <View style={styles.row}>
          <Card style={styles.cardSmall}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Entrenamientos</Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardSmall}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.statNumber}>750</Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </Card.Content>
          </Card>
        </View>

        {/* PROGRESO */}
        <View style={styles.section}>
          <Card style={styles.card}>
            <Card.Title title="Progreso semanal" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text style={styles.progressText}>70% completado</Text>
              <ProgressBar progress={0.7} style={styles.progressBar} color="#9ca3af" />
            </Card.Content>
          </Card>
        </View>

        {/* ACCESOS RAPIDOS */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Accesos rápidos</Text>

          <View style={styles.row}>
            <Card
              style={styles.cardMenu}
              onPress={() => navigation.navigate('Categories')}
            >
              <Card.Content>
                <Text style={styles.menuText}>Grupos Musculares</Text>
              </Card.Content>
            </Card>

            <Card style={styles.cardMenu}>
              <Card.Content>
                <Text style={styles.menuText}>🥗 Nutrición</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.row}>
            <Card style={styles.cardMenu}>
              <Card.Content>
                <Text style={styles.menuText}>📈 Progreso</Text>
              </Card.Content>
            </Card>

            <Card style={styles.cardMenu}>
              <Card.Content>
                <Text style={styles.menuText}>🏆 Desafíos</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* PROXIMO ENTRENAMIENTO */}
        <View style={styles.section}>
          <Card style={styles.card}>
            <Card.Title title="Próximo entrenamiento" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text variant="titleMedium" style={styles.workoutTitle}>Pecho y Tríceps</Text>
              <Text style={styles.workoutDetail}>Duración: 45 min</Text>
              <Text style={styles.workoutDetail}>Hora: 6:00 PM</Text>
            </Card.Content>

            <Card.Actions>
              <Button mode="contained" style={styles.button}>Iniciar</Button>
            </Card.Actions>
          </Card>
        </View>

        {/* HISTORIAL */}
        <View style={styles.section}>
          <Card style={styles.card}>
            <Card.Title title="Últimos entrenamientos" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text style={styles.historyText}>✔ Espalda</Text>
              <Text style={styles.historyText}>✔ Piernas</Text>
              <Text style={styles.historyText}>✔ Hombros</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardSmall: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardMenu: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#707783ff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#798494ff',
    textAlign: 'center',
    marginTop: 5,
  },
  cardTitle: {
    color: '#6f7786ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressText: {
    fontSize: 16,
    color: '#5a616eff',
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 10,
    height: 8,
    borderRadius: 4,
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  workoutTitle: {
    color: '#606672ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  workoutDetail: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#6b7280',
    borderRadius: 25,
  },
  historyText: {
    fontSize: 16,
    color: '#51565fff',
    marginBottom: 5,
  },
});

export default HomeScreen;
