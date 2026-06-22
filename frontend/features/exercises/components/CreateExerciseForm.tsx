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
import { Picker } from '@react-native-picker/picker';
type FormData = {
  name: string;
  description: string;
  level: string;
  categoryId: string;
};

type Exercise = {
  id?: string;
  name?: string;
  description?: string;
  level?: string;
  categoryId?: string;
};

type Props = {
  pickImage: () => void;
  file: any;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  exercise?: Exercise;
  categories:any[]
};

export default function CreateExerciseForm({
  pickImage,
  file,
  onSubmit,
  onDelete,
  exercise,
  categories
}: Props) {
  const isEdit = !!exercise?.id;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: exercise?.name || '',
      description: exercise?.description || '',
      level: exercise?.level || '',
      categoryId: exercise?.categoryId || '',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            {isEdit ? 'Actualizar ejercicio' : 'Crear ejercicio'}
          </Text>
          <Text style={styles.subtitle}>
            Usa un nombre claro y una imagen que inspire tu rutina.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre del ejercicio</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'El nombre es obligatorio' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ej. Sentadillas, Flexiones, Plancha"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

        <Text style={styles.label}>Descripción</Text>
        <Controller
          control={control}
          name="description"
          rules={{ required: 'La descripción es obligatoria' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Describe el ejercicio, sus beneficios y cómo realizarlo."
              value={value}
              onChangeText={onChange}
              style={[styles.input, { height: 100 }]}
              placeholderTextColor="#9ca3af"
              multiline
            />
          )}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}

        <Text style={styles.label}>Nivel de dificultad</Text>
        <Controller
          control={control}
          name="level"
          rules={{ required: 'El nivel es obligatorio' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ej. Principiante, Intermedio, Avanzado"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          )}
        />
        {errors.level && <Text style={styles.error}>{errors.level.message}</Text>}

        <Text style={styles.label}>Categoría</Text>

<Controller
  control={control}
  name="categoryId"
  rules={{
    required: 'La categoría es obligatoria',
  }}
  render={({ field: { onChange, value } }) => (
    <Picker
      selectedValue={value}
      onValueChange={onChange}
    >
      <Picker.Item
        label="Seleccione una categoría"
        value=""
      />

      {categories.map(category => (
        <Picker.Item
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </Picker>
  )}
/>

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
              Añade una imagen para que el ejercicio luzca mejor.
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
