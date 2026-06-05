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
      colors={['#0b1120', '#101827']}
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
        <View style={styles.brandContainer}>
          <Text style={styles.headerTitle}>Men_Women_Gym</Text>
          <Text style={styles.headerSubtitle}>Tu espacio fitness</Text>
        </View>
        <Pressable onPress={() => setProfileVisible(true)} style={styles.avatarContainer}>
          <Avatar.Text
            size={44}
            label={profileName.charAt(0).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
        </Pressable>
      </Appbar.Header>

      <View style={styles.section}>
        <Text style={styles.title}>Hola, {profileName}</Text>
        <Text style={styles.subtitle}>Prepárate para superar tu marca de hoy</Text>
      </View>

      <Portal>
        <Modal
          visible={profileVisible}
          onDismiss={() => setProfileVisible(false)}
          contentContainerStyle={styles.profileDrawer}
        >
          <View style={styles.profileContent}>
            <Text style={styles.profileTitle}>Perfil</Text>
            <Text style={styles.profileSubtitle}>Gestiona tu cuenta y mantén tus datos actualizados.</Text>

            <Avatar.Text
              size={72}
              label={profileName.charAt(0).toUpperCase()}
              style={styles.profileAvatar}
              labelStyle={styles.profileAvatarLabel}
            />

            <Text style={styles.profileName}>{profileName}</Text>

            <Button
              mode="contained"
              buttonColor="#38bdf8"
              textColor="#0f172a"
              style={styles.profileButton}
              onPress={() => {
                setProfileVisible(false);
                setProfileFormVisible(true);
              }}
            >
              Editar perfil
            </Button>

            <Button
              mode="outlined"
              icon="logout"
              textColor="#94a3b8"
              style={styles.logoutButton}
              onPress={() => {
                setProfileVisible(false);
                setModalVisible(true);
              }}
            >
              Cerrar sesión
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
    backgroundColor: 'transparent',
    elevation: 0,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    color: '#f8fafc',
    fontWeight: '900',
    fontSize: 20,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  avatarContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
    padding: 2,
  },
  avatar: {
    backgroundColor: '#38bdf8',
  },
  avatarLabel: {
    color: '#0f172a',
    fontWeight: '800',
  },
  section: {
    marginTop: 18,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 22,
  },
  profileDrawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#111827',
    padding: 24,
    justifyContent: 'center',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  profileContent: {
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  profileSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  profileAvatar: {
    backgroundColor: '#38bdf8',
    marginBottom: 18,
  },
  profileAvatarLabel: {
    color: '#0f172a',
    fontWeight: '800',
  },
  profileName: {
    marginBottom: 18,
    fontWeight: '900',
    fontSize: 22,
    color: '#f8fafc',
    textAlign: 'center',
  },
  profileButton: {
    marginTop: 8,
    borderRadius: 28,
    width: '85%',
  },
  logoutButton: {
    marginTop: 14,
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 28,
    width: '85%',
  },
});

export default MainHeader;
