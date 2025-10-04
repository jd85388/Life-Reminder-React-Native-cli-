// src/Screens/LoginMejorado.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AnimacionYa from '../components/AnimacionMovil';
import AnimacionEfecto from '../components/AnimacionElement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

export default function LoginMejorado() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.42, 180);
  const cardWidth = Math.min(width * 0.94, 420);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const emailGuardado = await AsyncStorage.getItem('email');
        const passwordGuardado = await AsyncStorage.getItem('password');
        if (emailGuardado && passwordGuardado) {
          setEmail(emailGuardado);
          setPassword(passwordGuardado);
          setRecordar(true);
        }
      } catch (error) {
        console.error('Error cargando datos guardados:', error);
      }
    };
    cargarDatos();
  }, []);

  const validarEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const manejarLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Ingrese email y contraseña');
      return;
    }
    
    if (!validarEmail(email)) {
      setError('Ingrese un email válido');
      return;
    }

    setLoading(true);
    
    try {
      // Guardar credenciales si está marcado "recordar"
      if (recordar) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }

      // Intentar hacer login
      await login(email.trim(), password.trim());
      
      // Navegar al dashboard si el login es exitoso
      navigation.navigate('Dashboard');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient colors={['#4A90E2', '#1E90FF']} style={styles.flex}>
            <ImageBackground
              source={require('../assets/imagen/fondo2.png')}
              style={styles.bg}
              resizeMode="cover"
            >
              <View style={styles.container}>
                
                {/* Header con logo */}
                <View style={styles.header}>
                  <AnimacionEfecto duration={1500}>
                    <Image
                      source={require('../assets/imagen/logoLife.png')}
                      style={[styles.logo, { width: logoSize, height: logoSize }]}
                      resizeMode="contain"
                    />
                  </AnimacionEfecto>
                  <AnimacionYa style={styles.title} duration={2000}>
                    LIFE REMINDER
                  </AnimacionYa>
                  <AnimacionYa style={styles.subtitle} duration={2500}>
                    Ingresa a tu cuenta
                  </AnimacionYa>
                </View>

                {/* Formulario */}
                <AnimacionEfecto duration={2000}>
                  <View style={[styles.card, { width: cardWidth }]}>
                    
                    {/* Campo Email */}
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          placeholderTextColor="#9CA3AF"
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            setError('');
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>
                    </View>

                    {/* Campo Contraseña */}
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Contraseña"
                          placeholderTextColor="#9CA3AF"
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            setError('');
                          }}
                          secureTextEntry={!showPass}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeIcon}>
                          <Ionicons
                            name={showPass ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#6B7280"
                          />
                        </Pressable>
                      </View>
                    </View>

                    {/* Error */}
                    {error ? (
                      <Text style={styles.errorText}>{error}</Text>
                    ) : null}

                    {/* Recordar contraseña */}
                    <View style={styles.optionsContainer}>
                      <Pressable 
                        style={styles.checkboxContainer}
                        onPress={() => setRecordar(!recordar)}
                      >
                        <View style={[styles.checkbox, recordar && styles.checkboxChecked]}>
                          {recordar && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                        <Text style={styles.checkboxText}>Recordar credenciales</Text>
                      </Pressable>

                      <Pressable onPress={() => navigation.navigate('Recuperacion')}>
                        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                      </Pressable>
                    </View>

                    {/* Botón de Login */}
                    <Pressable
                      style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                      onPress={manejarLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
                      )}
                    </Pressable>

                    {/* Registro */}
                    <View style={styles.registerContainer}>
                      <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                      <Pressable onPress={() => navigation.navigate('Registro')}>
                        <Text style={styles.registerLink}>Regístrate</Text>
                      </Pressable>
                    </View>

                  </View>
                </AnimacionEfecto>
              </View>
            </ImageBackground>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#E5F3FF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});