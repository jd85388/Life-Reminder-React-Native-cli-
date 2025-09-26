import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AnimacionYa from '../components/AnimacionMovil';
import AnimacionEfecto from '../components/AnimacionElement';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        {/* Parte superior */}
        <View style={styles.topSection}>
          <Image
            source={require('../assets/imagen/caraBonita.png')}
            style={styles.logo}
          />
          <AnimacionYa style={styles.title} duration={2000}>
            LIFE REMINDER
          </AnimacionYa>
        </View>

        <View style={styles.bottomSection}>
          <AnimacionYa style={styles.subtitle} duration={2000}>
            Para nosotros cuidar de tu salud es muy importante,
            juntos podemos cuidar de ti.
          </AnimacionYa>

          <AnimacionEfecto duration={2000}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonTextPrimary}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </AnimacionEfecto>

          <AnimacionEfecto duration={2000}>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Registro')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonTextSecondary}>Registrarse</Text>
            </TouchableOpacity>
          </AnimacionEfecto>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: height * 0.03,   
    paddingBottom: height * 0.01, 
  },
  logo: {
    width: width * 0.62,
    height: width * 0.60,
    borderRadius: width * 0.3,
    resizeMode: 'cover',
    marginBottom: 20, 
  },
  title: {
    fontSize: width * 0.08,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    marginBottom: 5,
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: height * 0.08, 
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.04,
    lineHeight: width * 0.06,
  },
  buttonPrimary: {
    width: 300,                 
    backgroundColor: '#1E90FF',
    paddingVertical: 18,          
    borderRadius: 14,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonTextPrimary: {
    color: '#fff',
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  buttonSecondary: {
    width: 300,                 
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1E90FF',
    paddingVertical: 18,          
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonTextSecondary: {
    color: '#1E90FF',
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
});
