import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

import CreateCategoryForm from '../components/CreateCategoryForm';

import { CategoryRequest } from '../services/auth.api';

import { useAuthStore } from '../store/auth.store';

import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-toast-message';

import { api } from '../services/api';

import GlobalModal from '../global/components/GlobalModal';

const AdminDashboard = () => {
  const { logout, token } = useAuthStore();

  const [isModalVisible, setModalVisible] = useState(false);

  const [visible, setVisible] = useState(false);

  const [gridVisible, setGridVisible] = useState(false);

  const [file, setFile] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleLogout = async () => {
    await logout();
  };

  const getCategories = async () => {
    try {
      const response = await api.get('/categories');

      setCategories(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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
      await CategoryRequest({
        action: selectedCategory ? 'update' : 'create',

        id: selectedCategory?.id,

        data: {
          name: data.name,
        },

        file,

        token,
      });

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: selectedCategory
          ? 'Categoría actualizada correctamente'
          : 'Categoría creada correctamente',
      });

      setVisible(false);

      setSelectedCategory(null);

      setFile(null);

      getCategories();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: selectedCategory
          ? 'No se pudo actualizar la categoría'
          : 'No se pudo crear la categoría',
      });
    }
  };

  // DELETE
  const deleteCategory = async (id: string) => {
    try {
      await CategoryRequest({
        action: 'delete',
        id,
        token,
      });

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Categoría eliminada correctamente',
      });

      getCategories();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo eliminar la categoría',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <GlobalModal
        isVisible={isModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogout}
        confirmText="Sí, cerrar"
        cancelText="Cancelar"
      />

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedCategory(null);

          setFile(null);

          setVisible(true);
        }}
      >
        <Text style={styles.text}>Crear categoría</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setGridVisible(true);
        }}
      >
        <Text style={styles.text}>Ver categorías</Text>
      </TouchableOpacity>

      {/* MODAL CREATE / UPDATE */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CreateCategoryForm
              pickImage={pickImage}
              file={file}
              onSubmit={onSubmit}
              category={selectedCategory}
            />

            <TouchableOpacity
              style={[
                styles.openButton,
                {
                  backgroundColor: 'red',
                },
              ]}
              onPress={() => {
                setVisible(false);

                setSelectedCategory(null);

                setFile(null);
              }}
            >
              <Text style={styles.openButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL GRID */}
      <Modal visible={gridVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.gridModalContent}>
            <Text style={styles.modalTitle}>Categorías</Text>

            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item: any) => item.id.toString()}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              renderItem={({ item }) => (
                <View style={styles.gridItem}>
                  <Text style={styles.gridTitle}>{item.name}</Text>

                  <View style={styles.actionsContainer}>
                    {/* EDIT */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: '#3b82f6',
                        },
                      ]}
                      onPress={() => {
                        setSelectedCategory(item);

                        setGridVisible(false);

                        setVisible(false);
                      }}
                    >
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>

                    {/* DELETE */}
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: '#ef4444',
                        },
                      ]}
                      onPress={() => {
                        setCategoryToDelete(item);
                        setConfirmVisible(true);
                      }}
                    >
                      <Text style={styles.actionText}>Eliminar</Text>
                    </TouchableOpacity>

                    <Modal
                      visible={confirmVisible}
                      transparent
                      animationType="fade"
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.confirmModal}>
                          <Text style={styles.modalTitle}>
                            ¿Seguro que deseas eliminar esta categoría?
                          </Text>

                          <Text style={{ marginBottom: 20 }}>
                            {categoryToDelete?.name}
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              gap: 10,
                            }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.actionButton,
                                { backgroundColor: '#3b82f6' },
                              ]}
                              onPress={() => {
                                setConfirmVisible(false);
                                setCategoryToDelete(null);
                              }}
                            >
                              <Text style={styles.actionText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.actionButton,
                                { backgroundColor: '#ef4444' },
                              ]}
                              onPress={async () => {
                                await deleteCategory(categoryToDelete.id);
                                setConfirmVisible(false);
                                setCategoryToDelete(null);
                                setGridVisible(false);
                              }}
                            >
                              <Text style={styles.actionText}>Eliminar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              style={[
                styles.openButton,
                {
                  marginTop: 20,
                },
              ]}
              onPress={() => setGridVisible(false)}
            >
              <Text style={styles.openButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
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
    alignItems: 'center',
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

  gridModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  gridItem: {
    backgroundColor: '#1e293b',
    width: '48%',
    padding: 20,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },

  gridTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  actionsContainer: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  confirmModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
});
