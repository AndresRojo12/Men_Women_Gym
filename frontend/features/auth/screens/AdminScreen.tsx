import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNModal from 'react-native-modal';

import CreateCategoryForm from '../../categories/components/CreateCategoryForm';
import CreateExerciseForm from '../../exercises/components/CreateExerciseForm';
import ProfileForm from '../../users/components/ProfileForm';

import { CategoryRequest } from '../services/auth.api';
import { ExerciseRequest } from '../services/auth.api';

import { useAuthStore } from '../store/auth.store';

import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-toast-message';

import { api } from '../services/api';

import GlobalModal from '../global/components/GlobalModal';

const AdminDashboard = () => {
  const { logout, token, user } = useAuthStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileFormVisible, setProfileFormVisible] = useState(false);
  const [profilePreview, setProfilePreview] = useState({
    name: 'Admin',
    email: user?.email || '',
  });
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'exercise' | null>(
    null,
  );
  const [file, setFile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [hoveredCategory, setHoveredCategory] = useState<
    string | number | null
  >(null);
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

  useEffect(() => {
    const loadCustomerProfile = async () => {
      try {
        const response = await api.get('/customers/me');
        setProfilePreview({
          name: response.data.name || user?.email?.split('@')[0] || 'Admin',
          email: response.data.email || user?.email || '',
        });
      } catch (error) {
        setProfilePreview({
          name: user?.email?.split('@')[0] || 'Admin',
          email: user?.email || '',
        });
      }
    };

    loadCustomerProfile();
  }, [user]);

  const handleProfileSave = (updatedProfile: any) => {
    setProfilePreview({
      name: updatedProfile.name || profilePreview.name,
      email: updatedProfile.email || profilePreview.email,
    });
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
      await CategoryRequest({
        action: selectedCategory ? 'update' : 'create',
        id: selectedCategory?.id,
        data: {
          name: data.name,
        },
        file,
        token: token ?? '',
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

  const deleteCategory = async (id: string) => {
    try {
      await CategoryRequest({
        action: 'delete',
        id,
        token: token ?? '',
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

  // Similar functions for exercises can be implemented here (create/update/delete)

  const onSubmitExercise = async (data: any) => {
    try {
      await ExerciseRequest({
        action: selectedExercise ? 'update' : 'create',
        id: selectedExercise?.id,
        data: {
          name: data.name,
          description: data.description,
          level: data.level,
          categoryId: Number(data.categoryId), // Assuming you have a selected category for the exercise
        },
        file,
        token: token ?? '',
      });

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: selectedExercise
          ? 'Ejercicio actualizado correctamente'
          : 'Ejercicio creado correctamente',
      });

      setVisible(false);
      setSelectedExercise(null);
      setFile(null);
      getCategories(); // Refresh categories to reflect changes in exercises
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: selectedExercise
          ? 'No se pudo actualizar el ejercicio'
          : 'No se pudo crear el ejercicio',
      });
    }
  };

  return (
    <LinearGradient colors={['#0b1120', '#101827']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroTitle}>Hola, {profilePreview.name}</Text>
              <Text style={styles.heroSubtitle}>
                Bienvenido al panel de administración. Aquí puedes crear y
                gestionar categorías con estilo.
              </Text>
            </View>
            <Pressable
              style={styles.avatarBadge}
              onPress={() => setProfileVisible(true)}
            >
              <Text style={styles.avatarLetter}>
                {profilePreview.name.charAt(0).toUpperCase()}
              </Text>
            </Pressable>
          </View>

          <View style={styles.profileChips}>
            <View style={styles.profileChip}>
              <Text style={styles.profileChipText}>
                {user?.email || 'admin@tucorreo.com'}
              </Text>
            </View>
            <View style={styles.profileChip}>
              <Text style={styles.profileChipText}>Administrador</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías existentes</Text>
          <View style={styles.gridHeaderRow}>
            <Text style={styles.gridSectionSubtitle}>
              Galería de categorías disponibles
            </Text>
            <TouchableOpacity
              style={styles.createGridButton}
              onPress={() => {
                setModalType('category');
                setSelectedCategory(null);
                setFile(null);
                setVisible(true);
              }}
            >
              <Text style={styles.createGridButtonText}>Crear categoría</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createGridButton}
              onPress={() => {
                setModalType('exercise');
                setSelectedCategory(null);
                setFile(null);
                setVisible(true);
              }}
            >
              <Text style={styles.createGridButtonText}>Crear ejercicio</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            numColumns={4}
            keyExtractor={(item: any) => item.id.toString()}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            renderItem={({ item }) => {
              const isHovered = hoveredCategory === item.id;
              return (
                <View style={styles.categoryItem}>
                  <Pressable
                    onHoverIn={() => setHoveredCategory(item.id)}
                    onHoverOut={() => setHoveredCategory(null)}
                    onPress={() => {
                      setModalType('category');
                      setSelectedCategory(item);
                      setVisible(true);
                    }}
                    style={styles.categoryImageWrapper}
                  >
                    <Image
                      source={{
                        uri: item.image || 'https://picsum.photos/300',
                      }}
                      style={[
                        styles.categoryImage,
                        isHovered && styles.categoryImageHover,
                      ]}
                    />
                  </Pressable>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.categoryIconRow}>
                    <Pressable
                      style={[styles.iconButton]}
                      onPress={() => {
                        setSelectedCategory(item);
                        setVisible(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={18}
                        color="#fff"
                      />
                    </Pressable>
                    <Pressable
                      style={[styles.iconButton]}
                      onPress={() => {
                        setCategoryToDelete(item);
                        setConfirmVisible(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={18}
                        color="#fff"
                      />
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsRow}>
            <View style={[styles.smallCard, styles.accentCard1]}>
              <Text style={styles.statNumber}>{categories.length}</Text>
              <Text style={styles.statLabel}>Categorías</Text>
            </View>
            <View style={[styles.smallCard, styles.accentCard2]}>
              <Text style={styles.statNumber}>Activo</Text>
              <Text style={styles.statLabel}>Modo administrador</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <GlobalModal
        isVisible={isModalVisible}
        title="Cerrar sesión"
        message="¿Estás seguro que deseas cerrar sesión?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogout}
        confirmText="Sí, cerrar"
        cancelText="Cancelar"
      />

      <RNModal
        isVisible={profileVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.55}
        onBackdropPress={() => setProfileVisible(false)}
        style={styles.profileModalWrapper}
      >
        <View style={styles.profileModalContent}>
          <Text style={styles.modalTitle}>Perfil</Text>
          <View style={styles.profileInfoRow}>
            <View style={styles.profileAvatarLarge}>
              <Text style={styles.profileAvatarLetter}>
                {profilePreview.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfoText}>
              <Text style={styles.profileInfoName}>{profilePreview.name}</Text>
              <Text style={styles.profileInfoEmail}>
                {profilePreview.email || 'Sin correo'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileActionButton}
            onPress={() => {
              setProfileVisible(false);
              setProfileFormVisible(true);
            }}
          >
            <Text style={styles.profileActionText}>Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileActionButton, styles.logoutOutlineButton]}
            onPress={() => {
              setProfileVisible(false);
              setModalVisible(true);
            }}
          >
            <Text style={styles.logoutOutlineText}>Cerrar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setProfileVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </RNModal>

      <ProfileForm
        visible={profileFormVisible}
        onDismiss={() => setProfileFormVisible(false)}
        onSave={handleProfileSave}
      />

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalType === 'category' && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedCategory ? 'Editar categoría' : 'Nueva categoría'}
                </Text>

                <CreateCategoryForm
                  pickImage={pickImage}
                  file={file}
                  onSubmit={onSubmit}
                  category={selectedCategory}
                />
              </>
            )}

            {modalType === 'exercise' && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedExercise ? 'Editar ejercicio' : 'Nuevo ejercicio'}
                </Text>

                <CreateExerciseForm
                  pickImage={pickImage}
                  file={file}
                  onSubmit={onSubmitExercise}
                  exercise={selectedExercise}
                  categories={categories} // Pass categories to the exercise form for selection
                />
              </>
            )}

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                setVisible(false);
                setModalType(null);
                setSelectedCategory(null);
                setSelectedExercise(null);
                setFile(null);
              }}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.confirmModal}>
            <Text style={styles.modalTitle}>
              ¿Seguro que deseas eliminar esta categoría?
            </Text>
            <Text style={styles.confirmText}>{categoryToDelete?.name}</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.smallActionButton, styles.editButton]}
                onPress={() => {
                  setConfirmVisible(false);
                  setCategoryToDelete(null);
                }}
              >
                <Text style={styles.actionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallActionButton, styles.deleteButton]}
                onPress={async () => {
                  await deleteCategory(categoryToDelete.id);
                  setConfirmVisible(false);
                  setCategoryToDelete(null);
                }}
              >
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1120',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    lineHeight: 22,
    width: '85%',
  },
  avatarBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '900',
  },
  profileChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  profileChip: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
  },
  profileChipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 18,
    minHeight: 140,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  actionCardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  actionCardSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    minHeight: 110,
    justifyContent: 'center',
  },
  accentCard1: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  accentCard2: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  statNumber: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#0ea5e9',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginHorizontal: 2,
    width: '80%',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 20,
  },
  profileModalWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    maxHeight: '95%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#f8fafc',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#0e2733',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  profileModalContent: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    width: '90%',
    maxWidth: 340,
    alignSelf: 'center',
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  profileAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarLetter: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '900',
  },
  profileInfoText: {
    flex: 1,
  },
  profileInfoName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  profileInfoEmail: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  profileActionButton: {
    backgroundColor: '#2289c5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 12,
    minWidth: 200,
  },
  profileActionText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  logoutOutlineButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutOutlineText: {
    color: '#ef4444',
    fontWeight: '800',
  },
  gridModalContent: {
    backgroundColor: '#111827',
    padding: 24,
    borderRadius: 24,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
    maxHeight: '50%',
  },
  gridSectionSubtitle: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  createGridButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  createGridButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridContent: {
    paddingBottom: 16,
    width: '100%',
  },
  categoryItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 22,
    marginBottom: 18,
    width: 180,
    minWidth: 180,
    alignItems: 'center',
    padding: 16,
  },
  categoryImageWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
  },
  categoryImage: {
    width: 180,
    height: 300,
    borderRadius: 22,
    backgroundColor: '#1f2937',
  },
  categoryImageHover: {
    transform: [{ scale: 1.05 }],
  },
  categoryName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryIconRow: {
    flexDirection: 'row',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 14,
    marginHorizontal: 4,
  },

  categoryButtons: {
    width: '100%',
    gap: 6,
  },
  categoryActionButton: {
    borderRadius: 14,
    paddingVertical: 6,
    alignItems: 'center',
  },
  categoryEditButton: {
    backgroundColor: '#3b82f6',
  },
  categoryDeleteButton: {
    backgroundColor: '#ef4444',
  },
  smallActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    marginRight: 0,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  confirmModal: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  confirmText: {
    color: '#cbd5e1',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
