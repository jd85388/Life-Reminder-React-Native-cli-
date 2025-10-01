/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import AnimatedSplash from './src/Screens/AnimatedSplash';
import Home from './src/Screens/Home';
import Registro from './src/Screens/Registro';
import Login from './src/Screens/Login';
import Recuperacion from './src/Screens/Recuperacion';
import Dashboard from './src/Screens/Dashboard';
import ConsultasScreen from './src/Screens/ConsultasScreen';
import MedicamentosScreen from './src/Screens/MedicamentosScreen';
import RecordatoriosScreen from './src/Screens/RecordatoriosScreen';
import RegistrosScreen from './src/Screens/RegistrosScreen';
import RegistroMedicamentoScreen from './src/Screens/RegistroMedicamentoScreen';
import RegistroConsultaScreen from './src/Screens/RegistroConsultaScreen';

export type RootStackParamList = {
  animatedSplash: undefined;
  Home: undefined;
  Registro: undefined;
  Login: undefined;
  Recuperacion: undefined;
  Dashboard: undefined;
  ConsultasScreen: undefined;
  MedicamentosScreen: undefined;
  RecordatoriosScreen: undefined;
  RegistrosScreen: undefined;
  RegistroMedicamentoScreen: undefined;
  RegistroConsultaScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="animatedSplash">
          <Stack.Screen name="animatedSplash" component={AnimatedSplash} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registro" component={Registro} />
          <Stack.Screen name="Recuperacion" component={Recuperacion} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ConsultasScreen" component={ConsultasScreen} />
          <Stack.Screen name="MedicamentosScreen" component={MedicamentosScreen} />
          <Stack.Screen name="RecordatoriosScreen" component={RecordatoriosScreen} />
          <Stack.Screen name="RegistrosScreen" component={RegistrosScreen} />
          <Stack.Screen name="RegistroMedicamentoScreen" component={RegistroMedicamentoScreen} />
          <Stack.Screen name="RegistroConsultaScreen" component={RegistroConsultaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
