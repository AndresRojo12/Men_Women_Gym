import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { z } from 'zod';
import { RegisterFormProps } from '@/features/auth/types/types';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ImageBackground,
} from 'react-native';

const registerSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const RegisterForm = ({ onSubmit, onGoToLogin }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
          case 400:
            message = 'Correo inválido o datos incompletos';
            break;
          case 409:
            message = 'El usuario ya está registrado';
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

      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  };

  return (
    <View style={styles.screen}>

      {/* Fondo */}
      <ImageBackground
        source={require('@/assets/gym.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          style={styles.input}
          secureTextEntry
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

         <View style= {styles.buttonContainer}>

          <Button title="Registrarse" onPress={handleSubmit} color="#b9b4b4ff"/>
         </View>

        <View style={styles.buttonContainers}>
          <Button title="Ya tienes cuenta inicia sesión" onPress={onGoToLogin} color="transparent" />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  backgroundImage: {
    opacity: 0.15,
    resizeMode: 'contain',
  },

  container: {
    width: 400,
    padding: 16,
    position: 'absolute',
    marginTop: 200,
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    color: '#7b837c',
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

  error: {
    color: 'red',
    marginBottom: 8,
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