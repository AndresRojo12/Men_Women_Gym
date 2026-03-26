import React, { useState } from 'react';
import { LoginFormProps } from '@/features/auth/types/types';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Formato de correo inválido')
    .trim(),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(50, 'La contraseña es demasiado larga'),
});

const LoginForm = ({ onSubmit, onGoToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
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
      const response = await onSubmit(email, password);

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: response.message,
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
  };

  return (
    <View style={styles.screen}>
      {/* Fondo con la silueta */}
      <ImageBackground
        source={require('@/assets/gym.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="contain"
      />

      {/* Login encima */}
      <View style={styles.container}>
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          style={styles.input}
        />

        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <TextInput
          placeholder="Contraseña"
          value={password}
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          style={styles.input}
        />

        {errors.password ? (
          <Text style={styles.error}>{errors.password}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" onPress={handleLogin} color="#b9b4b4ff" />
        </View>

        <View style={styles.buttonContainers}>
          <Button
            title="¿No tienes cuenta? Regístrate"
            onPress={onGoToRegister} color="transparent"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    padding: 16,
    color: 'black',
    width: 400,
    position: 'absolute',
    top: '35%',
  },
  input: {
    marginBottom: 12,
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    borderColor: '#d4cfcfee',
  },
  error: { color: 'red', marginBottom: 8 },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundImage: {
    opacity: 0.15,
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },

  buttonContainer: {
    borderWidth: 2,
    borderColor: '#b0b9b0ff',
    borderRadius: 12,
    backgroundColor: '#b0b9b0ff',
    overflow: 'hidden',
    marginBottom: 12,
  },

  buttonContainers: {
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#b0b9b0ff',
    backgroundColor: '#b0b9b0ff',
    overflow: 'hidden',
    marginBottom: 12,
  },
});

export default LoginForm;
