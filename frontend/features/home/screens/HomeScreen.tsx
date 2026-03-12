import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../auth/types/types';
import { useAuthStore } from '../../auth/store/auth.store';
import GlobalModal from '../../auth/global/components/GlobalModal';

const HomeScreen = () => {
  type HomeNavProp = NativeStackNavigationProp<AuthStackParamList, 'Home'>;
  const navigation = useNavigation<HomeNavProp>();
  const logout = useAuthStore((state) => state.logout);
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ marginBottom: 50, alignItems: 'center' }}>
      <Text>Home Screen</Text>

      <Button title="Ir a categorías" onPress={() => navigation.navigate('Categories')}/>
      <Button title="Logout" onPress={() => setModalVisible(true)} />

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
  );
};

export default HomeScreen;