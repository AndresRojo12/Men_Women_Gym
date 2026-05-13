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

type Props = {
  pickImage: () => void;
  file: any;
  onSubmit: (data: FormData) => void;
};

export default function CreateCategoryForm({
  pickImage,
  file,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <View>
      <Text style={styles.text}>Crear categoría</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: 'El nombre es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Nombre"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Seleccionar imagen</Text>
      </TouchableOpacity>

      {file && (
        <Image
          source={{ uri: file.uri }}
          style={{ width: 100, height: 100, marginBottom: 10 }}
        />
      )}

      {errors.file && <Text style={styles.error}>{errors.file.message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Crear categoría</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
