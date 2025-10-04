/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import Rutas from './src/navigation/navegacionVistas';
import AnimatedSplash from './src/Screens/Animaciones/AnimatedSplash';

export type RootStackParamList = {
  animatedSplash: undefined;
  Rutas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  const [isSplashVisible, setIsSplashVisible] =useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false}}>
                <Stack.Screen name="animatedSplash" component={AnimatedSplash}/>
                <Stack.Screen name="Rutas" component={Rutas}/>
              </Stack.Navigator>
            </NavigationContainer>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    );
}
