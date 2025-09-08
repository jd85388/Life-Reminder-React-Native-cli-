// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screens/Login';
import HomeScreen from '../Screens/Home';
import OtraPantalla from '../Screens/Registro';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="otra" component={OtraPantalla} />
    </Stack.Navigator>
  );
}