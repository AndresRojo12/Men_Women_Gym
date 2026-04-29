import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Appbar, Avatar, Text, Modal, Portal, Button } from 'react-native-paper';
import { useAuthStore } from '../../auth/store/auth.store';
import { api } from '../../auth/services/api';
import GlobalModal from '../../auth/global/components/GlobalModal';
import ProfileForm from '../../users/components/ProfileForm';

interface MainHeaderProps {
  userName?: string;
}

interface UserProfile {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ userName }) => {
  const [profileName, setProfileName] = useState<string>('Usuario');
  const [profileVisible, setProfileVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileFormVisible, setProfileFormVisible] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<UserProfile>('/customers/me');
        setProfileName(response.data.name || 'Usuario');
      } catch (error) {
        console.warn('No se pudo obtener el nombre de usuario:', error);
        if (userName) {
          setProfileName(userName);
        }
      }
    };

    fetchProfile();
  }, [userName]);

  const handleLogout = async () => {
    setModalVisible(false);
    setProfileVisible(false);
    await logout();
  };

  const handleProfileSave = (updatedProfile: UserProfile) => {
    setProfileName(updatedProfile.name || 'Usuario');
    setProfileFormVisible(false);
  };

  return (
    <LinearGradient
      colors={['#000000', '#374151']}
      style={styles.container}
    >
      <GlobalModal
        isVisible={isModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogout}
        confirmText="Sí, cerrar"
        cancelText="Cancelar"
      />

      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Men_Women_Gym" titleStyle={styles.headerTitle} />
        <Pressable onPress={() => setProfileVisible(true)} style={styles.avatarContainer}>
          <Avatar.Text
            size={40}
            label={profileName.charAt(0).toUpperCase()}
          />
        </Pressable>
      </Appbar.Header>

      <View style={styles.section}>
        <Text style={styles.title}>Hola, {profileName}</Text>
        <Text style={styles.subtitle}>Listo para tu entrenamiento de hoy</Text>
      </View>

      <Portal>
        <Modal
          visible={profileVisible}
          onDismiss={() => setProfileVisible(false)}
          contentContainerStyle={styles.profileDrawer}
        >
          <View style={styles.profileContent}>
            <Avatar.Text
              size={70}
                label={profileName.charAt(0).toUpperCase()}
            />

            <Text style={styles.profileName}>{profileName}</Text>

            <Button
              mode="contained"
              style={styles.profileButton}
              onPress={() => {
                setProfileVisible(false);
                setProfileFormVisible(true);
              }}
            >
              Perfil
            </Button>

            <Button
              mode="contained"
              icon="logout"
              style={styles.logoutButton}
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

      <ProfileForm
        visible={profileFormVisible}
        onDismiss={() => setProfileFormVisible(false)}
        onSave={handleProfileSave}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#000000',
    elevation: 5,
    
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  avatarContainer: {
    marginRight: 12,
  },
  section: {
    marginTop: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  profileDrawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  profileContent: {
    alignItems: 'center',
  },
  profileName: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#323435ff',
    textAlign: 'center',
  },
  profileButton: {
    marginTop: 25,
    backgroundColor: '#5d6569ff',
    borderRadius: 25,
    width: '80%',
  },
  logoutButton: {
    marginTop: 15,
    backgroundColor: '#ddd8d8ff',
    borderRadius: 25,
    width: '80%',
  },
});

export default MainHeader;
