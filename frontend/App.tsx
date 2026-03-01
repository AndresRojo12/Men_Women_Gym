import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './features/auth.types';

import LoginScreen from './features/auth/screens/LoginScreen';
import { RegisterScreen } from './features/auth/screens/RegisterScreen';
import HomeScreen from './features/home/screens/HomeScreen';

import { useAuthStore } from './features/auth/store/auth.store';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
