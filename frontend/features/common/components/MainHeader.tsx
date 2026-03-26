import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Appbar, Avatar, Text } from 'react-native-paper';
import { api } from '../../auth/services/api';

interface MainHeaderProps {
  userName?: string;
  onPressAvatar?: () => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ userName, onPressAvatar }) => {
  const [profileName, setProfileName] = useState<string>('Usuario');

  useEffect(() => {
    const fetchProfile = async () => {
      if (userName) {
        setProfileName(userName);
        return;
      }

      try {
        const response = await api.get<{ id: number; name: string }>('/customers/me');
        setProfileName(response.data.name || 'Usuario');
      } catch (error) {
        console.warn('No se pudo obtener el nombre de usuario:', error);
        setProfileName('Usuario');
      }
    };

    fetchProfile();
  }, [userName]);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Men_Women_Gym" />
        <Pressable onPress={onPressAvatar}>
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
});

export default MainHeader;
