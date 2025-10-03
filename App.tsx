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
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
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
import SettingsScreen from './src/Screens/SettingsScreen';
import TermsConditionsScreen from './src/Screens/TermsConditionsScreen';
import PrivacyPolicyScreen from './src/Screens/PrivacyPolicyScreen';
import LegalNoticesScreen from './src/Screens/LegalNoticesScreen';
import NotificationHistoryScreen from './src/Screens/NotificationHistoryScreen';

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
  Settings: undefined;
  TermsConditions: undefined;
  PrivacyPolicy: undefined;
  LegalNotices: undefined;
  NotificationHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
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
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ headerShown: true }} 
              />
              <Stack.Screen 
                name="TermsConditions" 
                component={TermsConditionsScreen} 
                options={{ headerShown: true }} 
              />
              <Stack.Screen 
                name="PrivacyPolicy" 
                component={PrivacyPolicyScreen} 
                options={{ headerShown: true }} 
              />
              <Stack.Screen 
                name="LegalNotices" 
                component={LegalNoticesScreen} 
                options={{ headerShown: true }} 
              />
              <Stack.Screen 
                name="NotificationHistory" 
                component={NotificationHistoryScreen} 
                options={{ headerShown: true }} 
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
