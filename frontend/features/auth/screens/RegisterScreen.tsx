import React from 'react';
import { useState, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, StyleSheet} from 'react-native';
import { RegisterForm } from '../components/RegisterForm';
import { RegisterRequest } from '../services/auth.api';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../types/auth.types';
import { Loading } from '../components/Loading';

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const RegisterScreen = () => {
  const [loading, setLoading] = useState(true)
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

  const handleRegister = async (email: string, password: string): Promise<{email: string}> => {
  try {
    const response = await RegisterRequest(email, password); 

    return {email: response.email}
  } catch (error: any) {
    throw error; 
  }
  }

  return (
    <View>
      <RegisterForm onSubmit={handleRegister} onGoToLogin={()=> navigation.navigate('Login')} />
    </View>
  );}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
});