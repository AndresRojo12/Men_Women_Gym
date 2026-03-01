import React, { useState } from 'react';
import { LoginFormProps } from '../types';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido")
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña es demasiado larga"),
});


const LoginForm= ({ onSubmit, onGoToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>(
      {}
    );

const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });

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
      const response = await onSubmit(email, password );

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: response.message
      });
    } catch (error: any) {
      let message = 'Ocurrió un error inesperado';
  
  if (error.response) {
    switch (error.response.status) {
      case 400:
        message = 'Correo o contraseña incorrectos';
        break;
      case 401:
        message = 'Correo o contraseña incorrectos';
        break;
      case 500:
        message = 'Error del servidor. Intenta más tarde';
        break;
      default:
        message = error.response.data?.message || message;
    }
  } else if (error.request) {
    message = 'No se pudo conectar con el servidor';
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
  });
    }   
 }
  
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        style={styles.input}
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
        secureTextEntry
        style={styles.input}
      />
      {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

      <Button title="Login" onPress={handleLogin} />

      <View style={{ marginTop: 12 }}>
        <Button
          title="¿No tienes cuenta? Regístrate"
          onPress={onGoToRegister}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 4, borderWidth: 1, padding: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 8 },
})

export default LoginForm;