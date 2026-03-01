import React from 'react';
import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../store/auth.store';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../types/auth.types';
import { Loading } from '../components/Loading';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const login = useAuthStore((state) => state.login);
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    );
  }
  
  const handleLogin = async (email: string, password: string): Promise<{ message: string }> => {
  try {
    await login(email, password); 
    return { message: 'Login exitoso' };
  } catch (error: any) {
    throw error; 
  }
};

  return (
    <View style={styles.container}>
      <LoginForm onSubmit={handleLogin} onGoToRegister={()=>navigation.navigate('Register')}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
});

export default LoginScreen;