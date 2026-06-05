import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
  name: string;
};

type Category = {
  id?: string;
  name?: string;
};

type Props = {
  pickImage: () => void;
  file: any;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  category?: Category;
};

export default function CreateCategoryForm({
  pickImage,
  file,
  onSubmit,
  onDelete,
  category,
}: Props) {
  const isEdit = !!category?.id;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: category?.name || '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            {isEdit ? 'Actualizar categoría' : 'Crear categoría'}
          </Text>
          <Text style={styles.subtitle}>
            Usa un nombre claro y una imagen que inspire tu rutina.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de categoría</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'El nombre es obligatorio' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ej. Fuerza, Cardio, Estiramiento"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>Seleccionar imagen</Text>
        </TouchableOpacity>

        {file ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
            <Text style={styles.previewLabel}>Imagen seleccionada</Text>
          </View>
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewText}>
              Añade una imagen para que la categoría luzca mejor.
            </Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitText}>
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Text>
          </TouchableOpacity>
          {isEdit && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 600,
    paddingVertical: 12,
  },
  headerRow: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f9fafb',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  imageButton: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  previewContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  previewImage: {
    width: '100%',
    height: 140,
  },
  previewLabel: {
    padding: 12,
    color: '#d1d5db',
    backgroundColor: '#111827',
    textAlign: 'center',
    fontSize: 13,
  },
  emptyPreview: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPreviewText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  error: {
    color: '#fca5a5',
    marginBottom: 12,
  },
});
