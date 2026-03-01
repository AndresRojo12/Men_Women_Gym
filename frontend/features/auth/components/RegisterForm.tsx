import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import { RegisterFormProps } from '../types';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from 'react-native';


const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegisterForm = ({
  onSubmit,
  onGoToLogin,
}: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>(
    {}
  );

  const handleSubmit = async () => {
    const result = registerSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as 'email' | 'password';
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

     try {
  const user = await onSubmit(email, password);

  Toast.show({
    type: 'success',
    text1: 'Registro exitoso',
    text2: `Usuario ${user.email} creado correctamente.`,
  });

   setEmail('');
  setPassword('');

  
} catch (error: any) {
  let message = 'Error desconocido';
  if (error.response) {
    switch (error.response.status) {
      case 400: message = 'Correo inválido o datos incompletos'; break;
      case 409: message = 'El usuario ya está registrado'; break;
      case 500: message = 'Error del servidor. Intenta más tarde'; break;
      default: message = error.response.data?.message || message;
    }
  } else if (error.request) {
    message = 'No se pudo conectar con el servidor';
  }

  Toast.show({ type: 'error', text1: 'Error', text2: message });
} 
  
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        style={styles.input}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <Button
        title={'Register'}
        onPress={handleSubmit}
      />

      <View style={{ marginTop: 12 }}>
        <Button
          title="Ya tienes cuenta inicia sesión"
          onPress={onGoToLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: { color: 'red', marginBottom: 8 },
})