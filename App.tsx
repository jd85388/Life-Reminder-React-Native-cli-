/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import AnimatedSplash from './src/Screens/AnimatedSplash';
import Home from './src/Screens/Home';
import Registro from './src/Screens/Registro';
import Login from './src/Screens/Login';
import Recuperacion from './src/Screens/Recuperacion';
import ConfiguracionPerfil from './src/Screens/Perfil';
import CambiarDatos from './src/Screens/cambioDatos';
import CambiarFotoScreen from './src/Screens/cambioFoto';
import InfoLifeReminder from './src/Screens/informacion';
import ContactarSoporteScreen from './src/Screens/contactoSoporte';
import ConfiguracionAppScreen from './src/Screens/configurarApp';
import CambioContrasenaScreen from './src/Screens/cambioContrasena';

export type RootStackParamList = {
  animatedSplash: undefined;
  Home: undefined;
  Registro: undefined;
  Login: undefined;
  Recuperacion: undefined;
  Perfil: undefined;
  cambioDatos: undefined;
  cambioFoto: undefined;
  informacion: undefined;
  contactoSoporte: undefined;
  configurarApp: undefined;
  cambioContrasena: undefined;
  
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="animatedSplash">
        <Stack.Screen name="animatedSplash" component={AnimatedSplash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Recuperacion" component={Recuperacion} />
        <Stack.Screen name="Perfil" component={ConfiguracionPerfil} />
        <Stack.Screen name="cambioDatos" component={CambiarDatos} />
        <Stack.Screen name="cambioFoto" component={CambiarFotoScreen} />
        <Stack.Screen name="informacion" component={InfoLifeReminder} />
        <Stack.Screen name="contactoSoporte" component={ContactarSoporteScreen} />
        <Stack.Screen name="configurarApp" component={ConfiguracionAppScreen} />
        <Stack.Screen name="cambioContrasena" component={CambioContrasenaScreen} />
        </Stack.Navigator>
        </NavigationContainer>
  );
}
