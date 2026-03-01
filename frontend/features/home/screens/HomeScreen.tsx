import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../../auth/store/auth.store';
import GlobalModal from '../../auth/global/components/GlobalModal';

const HomeScreen = () => {
  const logout = useAuthStore((state) => state.logout);
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Text>Home Screen</Text>

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