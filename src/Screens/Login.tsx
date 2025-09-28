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

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.42, 180);
  const cardWidth = Math.min(width * 0.94, 420);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const c = await AsyncStorage.getItem('correo');
        const p = await AsyncStorage.getItem('password');
        if (c && p) {
          setCorreo(c);
          setPassword(p);
          setRecordar(true);
        }
      } catch {}
    };
    cargarDatos();
  }, []);

  const validarEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const manejar = async () => {
    setError('');
    if (!correo || !password) {
      setError('Ingrese correo y contraseña');
      return;
    }
    if (!validarEmail(correo)) {
      setError('Ingrese un correo válido');
      return;
    }
    setLoading(true);
    try {
      if (recordar) {
        await AsyncStorage.setItem('correo', correo);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('correo');
        await AsyncStorage.removeItem('password');
      }
      const r = await fetch('http://192.168.0.12/Views/ingreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });
      const d = await r.json();
      if (r.ok) navigation.navigate('Home');
      else setError(d?.message || 'Credenciales incorrectas');
    } catch {
      setError('Error de red o servidor');
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
                <Image
                  source={require('../assets/imagen/logoLife.png')}
                  style={[styles.logo, { width: 400, height: 340 }]}
                />

                <View style={[styles.card, { width: cardWidth }]}>
                  <AnimacionEfecto duration={1400}>
                    <View style={styles.row}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="mail-outline" size={20} color="#4A90E2" style={styles.icon} />
                        <TextInput
                          value={correo}
                          onChangeText={setCorreo}
                          placeholder="Correo electrónico"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.input}
                          returnKeyType="next"
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" style={styles.icon} />
                        <TextInput
                          value={password}
                          onChangeText={setPassword}
                          placeholder="Contraseña"
                          placeholderTextColor="#9CA3AF"
                          secureTextEntry={!showPass}
                          style={styles.input}
                          returnKeyType="done"
                        />
                        <Pressable onPress={() => setShowPass(v => !v)} style={styles.eye}>
                          <Ionicons name={showPass ? 'eye' : 'eye-off'} size={18} color="#6B7280" />
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.rowSpace}>
                      <Pressable
                        onPress={() => setRecordar(r => !r)}
                        style={styles.rememberBtn}
                      >
                        <View style={[styles.checkbox, recordar && styles.checkboxActive]}>
                          {recordar && <Ionicons name="checkmark" size={16} color="#fff" />}
                        </View>
                        <Text style={styles.rememberText}>Recordarme</Text>
                      </Pressable>
                      <Pressable onPress={() => navigation.navigate('Recuperacion')}>
                        <Text style={styles.forgotText}>¿Olvidaste la contraseña?</Text>
                      </Pressable>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Pressable
                      onPress={manejar}
                      style={({ pressed }) => [styles.loginBtn, { opacity: pressed ? 0.9 : 1 }]}
                    >
                      <LinearGradient colors={['#1E90FF', '#4A90E2']} style={styles.loginGradient}>
                        {loading
                          ? <ActivityIndicator size="small" color="#fff" />
                          : <Text style={styles.loginText}>Iniciar Sesión</Text>}
                      </LinearGradient>
                    </Pressable>
                  </AnimacionEfecto>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.smallText}>¿No tienes cuenta? </Text>
                  <Pressable onPress={() => navigation.navigate('Registro')}>
                    <Text style={styles.linkText}>Regístrate</Text>
                  </Pressable>
                </View>
              </View>
            </ImageBackground>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1E90FF' },
  flex: { flex: 1 },
  bg: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  logo: { resizeMode: 'contain', borderRadius: 999, marginBottom: 18 },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 18,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8
  },
  row: { width: '100%', marginBottom: 10 },
  rowSpace: {
    width: '100%',
    marginTop: 6,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 60,
    borderColor: "black"
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: '100%', color: '#111827', fontSize: 15 },
  eye: { marginLeft: 8 },
  rememberBtn: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxActive: { backgroundColor: '#1E90FF', borderColor: '#1E90FF' },
  rememberText: { fontSize: 14, color: '#374151' },
  forgotText: { fontSize: 13, color: '#2563EB', fontWeight: '600' },
  errorText: { color: '#DC2626', fontSize: 13, marginTop: 6, alignSelf: 'flex-start' },
  loginBtn: {
    alignSelf: 'stretch',
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden'
  },
  loginGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18
  },
  smallText: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  linkText: { color: '#fff', fontWeight: '700', marginLeft: 6 }
});
