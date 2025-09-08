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

export type RootStackParamList = {
  animatedSplash: undefined;
  Home: undefined;
  Registro: undefined;
  Login: undefined;
  Recuperacion: undefined;
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
        </Stack.Navigator>
        </NavigationContainer>
  );
}
