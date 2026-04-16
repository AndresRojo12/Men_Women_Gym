import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './features/auth/types/types';

import LoginScreen from './features/auth/screens/LoginScreen';
import { RegisterScreen } from './features/auth/screens/RegisterScreen';
import HomeScreen from './features/home/screens/HomeScreen';

// screen categories
import CategoriesScreen from './features/categories/screens/GetCategories';
// screen exercises
import ExercisesScreen from './features/exercises/screens/GetExercises';

import { useAuthStore } from './features/auth/store/auth.store';

import '@/global.css';

const setting = {
  icon: (props: any) => <MaterialCommunityIcons {...props} />,
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Mantener sesión persistente al recargar (a menos que token ya esté vencido/401).
  const usePersistentSession = true;

  React.useEffect(() => {
    const init = async () => {
      if (usePersistentSession) {
        await useAuthStore.getState().initialize();
      } else {
        await useAuthStore.getState().logout();
      }
      setIsReady(true);
    };

    init();
  }, [usePersistentSession]);

  if (!isReady) {
    return null;
  }

  return (
    <PaperProvider settings={setting}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Exercises" component={ExercisesScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </PaperProvider>
  );
}
