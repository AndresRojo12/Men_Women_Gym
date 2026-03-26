import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../auth/types/types';
import { useAuthStore } from '../../auth/store/auth.store';
import GlobalModal from '../../auth/global/components/GlobalModal';
import MainHeader from '../../common/components/MainHeader';
import {
  Avatar,
  Text,
  Button,
  Card,
  ProgressBar,
  Modal,
  Portal,
  List,
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
  const logout = useAuthStore((state) => state.logout);
  const [isModalVisible, setModalVisible] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profilevisible, setProfileVisible] = useState(false);

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
    <ScrollView style={styles.container}>
      {/* CONTROLES SUPERIORES */}
      <View style={{ marginBottom: 10, alignItems: 'center' }}>
        <GlobalModal
          isVisible={isModalVisible}
          title="Cerrar sesión"
          message="¿Estás seguro que deseas cerrar sesión?"
          onCancel={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            logout();
          }}
          confirmText="Sí, cerrar"
          cancelText="Cancelar"
        />
      </View>

      <MainHeader
        userName={userProfile?.name}
        onPressAvatar={() => setProfileVisible(true)}
      />

      {/* ESTADISTICAS */}
      <View style={styles.row}>
        <Card style={styles.cardSmall}>
          <Card.Content>
            <Text variant="titleLarge">4</Text>
            <Text>Entrenamientos</Text>
          </Card.Content>
        </Card>

        <Card style={styles.cardSmall}>
          <Card.Content>
            <Text variant="titleLarge">750</Text>
            <Text>Calorías</Text>
          </Card.Content>
        </Card>
      </View>
      {/* PROGRESO */}
      <View style={styles.section}>
        <Card>
          <Card.Title title="Progreso semanal" />
          <Card.Content>
            <Text>70% completado</Text>
            <ProgressBar progress={0.7} style={{ marginTop: 10 }} />
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
              <Text>Grupos Musculares</Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardMenu}>
            <Card.Content>
              <Text>🥗 Nutrición</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.row}>
          <Card style={styles.cardMenu}>
            <Card.Content>
              <Text>📈 Progreso</Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardMenu}>
            <Card.Content>
              <Text>🏆 Desafíos</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* PROXIMO ENTRENAMIENTO */}
      <View style={styles.section}>
        <Card>
          <Card.Title title="Próximo entrenamiento" />
          <Card.Content>
            <Text variant="titleMedium">Pecho y Tríceps</Text>

            <Text>Duración: 45 min</Text>
            <Text>Hora: 6:00 PM</Text>
          </Card.Content>

          <Card.Actions>
            <Button mode="contained">Iniciar</Button>
          </Card.Actions>
        </Card>
      </View>

      {/* HISTORIAL */}
      <View style={styles.section}>
        <Card>
          <Card.Title title="Últimos entrenamientos" />
          <Card.Content>
            <Text>✔ Espalda</Text>
            <Text>✔ Piernas</Text>
            <Text>✔ Hombros</Text>
          </Card.Content>
        </Card>
      </View>
      <Portal>
        <Modal
          visible={profilevisible}
          onDismiss={() => setProfileVisible(false)}
          contentContainerStyle={styles.profileDrawer}
        >
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image
              size={70}
              source={{
                uri: 'https://randomuser.me/api/portraits/men/36.jpg',
              }}
            />

            <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 18 }}>
              {userProfile?.name || 'Usuario'}
            </Text>

            <Button
              mode="contained"
              icon="logout"
              style={{ marginTop: 30, backgroundColor: '#918585ff' }}
              onPress={() => {
                setProfileVisible(false);
                setModalVisible(true);
              }}
            >
              Logout
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000',
  },

  section: {
    marginTop: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d8cfcfff',
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  cardSmall: {
    width: '48%',
  },

  cardMenu: {
    width: '48%',
    marginBottom: 10,
  },

  profileDrawer: {
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: 260,
  backgroundColor: 'white',
  padding: 20,
  justifyContent: 'center',
},
});

export default HomeScreen;
