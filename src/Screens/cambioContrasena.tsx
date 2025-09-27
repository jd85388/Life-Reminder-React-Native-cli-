import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function CambioContrasenaScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validarEmail = (e: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e.toLowerCase());
  };

  const handleEnviarCodigo = async () => {
    setError('');
    if (!email.trim()) {
      setError('Por favor ingresa tu correo');
      return;
    }
    if (!validarEmail(email)) {
      setError('Correo no válido');
      return;
    }
    try {
      Alert.alert(
        'Código enviado',
        `Se ha enviado un código de verificación a ${email}`
      );
    } catch (e) {
      setError('Error al enviar el código');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Cambio de Contraseña</Text>
          <Text style={styles.subtitle}>
            Necesitamos tu correo para enviarte un código y autorizar el cambio de contraseña desde la app.
          </Text>

          <View style={styles.inputBox}>
            <Icon name="mail-outline" size={22} color="#6B7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleEnviarCodigo}>
            <Text style={styles.primaryButtonText}>Enviar Código</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  errorText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#0e7fc0',
    fontSize: 16,
    fontWeight: '700',
  },

});
