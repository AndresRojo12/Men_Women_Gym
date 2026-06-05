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
      colors={['#0b1120', '#101827']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainHeader userName={userProfile?.name} />

        <View style={styles.heroCard}>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            ¡Hola{userProfile?.name ? `, ${userProfile.name}` : '!'} 👋
          </Text>
          <Text style={styles.heroSubtitle}>
            Mantén el ritmo con tu rutina y supera tu mejor versión cada día.
          </Text>
          <Button
            mode="contained"
            buttonColor="#38bdf8"
            textColor="#0f172a"
            style={styles.heroButton}
            onPress={() => navigation.navigate('Exercises')}
          >
            Comenzar entrenamiento
          </Button>
        </View>

        <View style={styles.statsGrid}>
          <Card style={[styles.cardSmall, styles.cardAccent1]}>
            <Card.Content>
              <Text variant="displaySmall" style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Entrenamientos</Text>
            </Card.Content>
          </Card>

          <Card style={[styles.cardSmall, styles.cardAccent2]}>
            <Card.Content>
              <Text variant="displaySmall" style={styles.statNumber}>750</Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso semanal</Text>
          <Card style={styles.cardLarge}>
            <Card.Content>
              <Text style={styles.progressText}>70% completado</Text>
              <ProgressBar progress={0.7} style={styles.progressBar} color="#38bdf8" />
              <View style={styles.progressRow}>
                <Text style={styles.progressDetail}>Objetivo semanal</Text>
                <Text style={styles.progressDetail}>4/5 sesiones</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
          <View style={styles.menuGrid}>
            <Card style={styles.cardMenu} onPress={() => navigation.navigate('Exercises')}>
              <Card.Content>
                <Text style={styles.menuText}>🏋️‍♀️ Ejercicios</Text>
              </Card.Content>
            </Card>
            <Card style={styles.cardMenu} onPress={() => navigation.navigate('Routines')}
            >
              <Card.Content>
                <Text style={styles.menuText}>📋 Rutinas</Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.menuGrid}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo entrenamiento</Text>
          <Card style={styles.cardLarge}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.workoutTitle}>Pecho y Tríceps</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}><Text style={styles.badgeText}>45 min</Text></View>
                <View style={styles.badge}><Text style={styles.badgeText}>6:00 PM</Text></View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.actionsRow}>
              <Button
                mode="contained"
                buttonColor="#0ea5e9"
                textColor="#fff"
                style={styles.button}
              >
                Iniciar
              </Button>
              <Button
                mode="text"
                textColor="#94a3b8"
                onPress={() => navigation.navigate('Routines')}
              >
                Ver detalles
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimos entrenamientos</Text>
          <Card style={styles.cardLarge}>
            <Card.Content>
              <View style={styles.historyItem}><Text style={styles.historyText}>🟢 Espalda</Text></View>
              <View style={styles.historyItem}><Text style={styles.historyText}>🟣 Piernas</Text></View>
              <View style={styles.historyItem}><Text style={styles.historyText}>🔵 Hombros</Text></View>
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
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTitle: {
    color: '#f8fafc',
    fontWeight: '800',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  heroButton: {
    borderRadius: 999,
    paddingVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 14,
  },
  cardLarge: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  cardSmall: {
    width: '48%',
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  cardAccent1: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  cardAccent2: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#f8fafc',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
  },
  progressText: {
    fontSize: 15,
    color: '#e2e8f0',
    marginBottom: 14,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  progressDetail: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardMenu: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  menuText: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    fontWeight: '700',
  },
  workoutTitle: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#0f172a',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
  },
  badgeText: {
    color: '#bfdbfe',
    fontSize: 13,
    fontWeight: '600',
  },
  actionsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  button: {
    borderRadius: 999,
  },
  historyItem: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '600',
  },
});

export default HomeScreen;
