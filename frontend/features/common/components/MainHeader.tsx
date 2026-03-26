import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
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
    <>
      <GlobalModal
        isVisible={isModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogout}
        confirmText="Sí, cerrar"
        cancelText="Cancelar"
      />

      <Appbar.Header>
        <Appbar.Content title="Men_Women_Gym" />
        <Pressable onPress={() => setProfileVisible(true)}>
          <Avatar.Image
            size={40}
            source={{ uri: 'https://randomuser.me/api/portraits/men/36.jpg' }}
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
          <View style={{ alignItems: 'center' }}>
            <Avatar.Image
              size={70}
              source={{
                uri: 'https://randomuser.me/api/portraits/men/36.jpg',
              }}
            />

            <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 18 }}>
              {profileName}
            </Text>

            <Button
              mode="contained"
              style={{ marginTop: 20, backgroundColor: '#4CAF50' }}
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
              style={{ marginTop: 12, backgroundColor: '#918585ff' }}
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
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    marginHorizontal: 10,
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
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default MainHeader;
