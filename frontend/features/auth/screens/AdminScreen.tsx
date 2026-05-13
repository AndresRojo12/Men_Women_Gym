import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import CreateCategoryForm from '../components/CreateCategoryForm';
import { CreateCategoryRequest } from '../services/auth.api';
import { useAuthStore } from '../store/auth.store';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

const AdminDashboard = () => {
  const { logout, token } = useAuthStore();
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState<any>(null);

  const handleLogout = async () => {
    await logout();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await CreateCategoryRequest(data.name, file, token);

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría creada correctamente',
      });
      console.log(response);

      setVisible(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo crear la categoría',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Bienvenido, Admin 👋</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Aquí puedes gestionar usuarios</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.text}>Control de entrenamientos</Text>
      </View>
      <TouchableOpacity style={styles.card} onPress={() => setVisible(true)}>
        <Text style={styles.text}>Crear categoría</Text>
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CreateCategoryForm
              pickImage={pickImage}
              file={file}
              onSubmit={onSubmit}
            />

            <TouchableOpacity
              style={[styles.openButton, { backgroundColor: 'red' }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.openButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};
export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },

  input: {
    backgroundColor: '#334155',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  openButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
});
