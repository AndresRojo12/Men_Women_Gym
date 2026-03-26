import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Modal, Portal, Button, Text } from 'react-native-paper';
import { api } from '../../auth/services/api';

interface UserProfile {
  id: number;
  name: string;
  lastName: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
}

interface ProfileFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSave?: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ visible, onDismiss, onSave }) => {
  const [userProfileData, setUserProfileData] = useState<UserProfile>({
    id: 0,
    name: '',
    lastName: '',
    gender: '',
    age: 0,
    height: 0,
    weight: 0,
  });
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    name: '',
    lastName: '',
    gender: '',
    age: 0,
    height: 0,
    weight: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchProfileData();
    }
  }, [visible]);

  const fetchProfileData = async () => {
    try {
      const response = await api.get<UserProfile>('/customers/me');
      setUserProfileData(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await api.post('/customers', formData);
      const newProfile = response.data as UserProfile;
      setUserProfileData(newProfile);
      setFormData(newProfile);
      onSave?.(newProfile);
      onDismiss();
      alert('Perfil completado correctamente');
    } catch (error: any) {
      console.error('Error completando perfil:', error);
      alert('Error al completar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.formModal}
      >
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formTitle}>Editar Perfil</Text>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />

          <Text style={styles.label}>Género</Text>
          <TextInput
            style={styles.input}
            placeholder="Género"
            value={formData.gender}
            onChangeText={(text) => setFormData({ ...formData, gender: text })}
          />

          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            placeholder="Edad"
            value={formData.age ? String(formData.age) : ''}
            onChangeText={(text) => setFormData({ ...formData, age: parseInt(text, 10) || 0 })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Altura"
            value={formData.height ? String(formData.height) : ''}
            onChangeText={(text) => setFormData({ ...formData, height: parseFloat(text) || 0 })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Peso"
            value={formData.weight ? String(formData.weight) : ''}
            onChangeText={(text) => setFormData({ ...formData, weight: parseFloat(text) || 0 })}
            keyboardType="numeric"
          />

          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              style={{ flex: 1, marginRight: 8, backgroundColor: '#4CAF50' }}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              mode="outlined"
              style={{ flex: 1 }}
              onPress={onDismiss}
            >
              Cancelar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  formModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    maxHeight: '90%',
  },
  formContainer: {
    paddingBottom: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
});

export default ProfileForm;
