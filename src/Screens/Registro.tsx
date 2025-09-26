import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';

export default function RegistroScreen({ navigation }: any) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    documento: '',
    numero: '',
    password: '',
    fechaNacimiento: new Date(),
  });
  const [openDate, setOpenDate] = useState(false);

  const handleChange = (key: string, value: any) =>
    setForm({ ...form, [key]: value });

  const validarCampos = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^[0-9]{10}$/;

    if (
      !form.nombre ||
      !form.apellido ||
      !form.email ||
      !form.documento ||
      !form.numero ||
      !form.password
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return false;
    }
    if (!telRegex.test(form.numero)) {
      Alert.alert('Error', 'El número debe tener 10 dígitos');
      return false;
    }
    if (isNaN(Number(form.documento)) || Number(form.documento) < 1000000) {
      Alert.alert('Error', 'Documento inválido');
      return false;
    }
    const hoy = new Date();
    if (form.fechaNacimiento > hoy) {
      Alert.alert('Error', 'La fecha de nacimiento no puede ser futura');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;

    try {
      const response = await fetch('http://192.168.0.12:3000/Views/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email.toLowerCase(),
          documento: Number(form.documento),
          numero: form.numero,
          password: form.password,
          fechaNacimiento: form.fechaNacimiento.toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  function renderInput(
    label: string,
    key: string,
    icon: string,
    keyboardType: any = 'default',
    secure = false
  ) {
    
    if (key !== 'fechaNacimiento') {
      return (
        <View style={styles.inputContainer}>
          <Icon name={icon} size={24} color="#2E86C1" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder={label}
            placeholderTextColor="#7f8c8d"
            keyboardType={keyboardType}
            secureTextEntry={secure}
            value={(form as any)[key]}
            onChangeText={(v) => handleChange(key, v)}
          />
        </View>
      );
    }

    
    return (
      <TouchableWithoutFeedback onPress={() => setOpenDate(true)}>
        <View style={styles.inputContainer}>
          <Icon name={icon} size={24} color="#2E86C1" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder={label}
            placeholderTextColor="#7f8c8d"
            value={form.fechaNacimiento.toISOString().split('T')[0]}
            editable={false} 
            pointerEvents="none" 
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Registro de Usuario Nuevo</Text>

          {renderInput('Nombre', 'nombre', 'account')}
          {renderInput('Apellido', 'apellido', 'account-outline')}
          {renderInput('Correo electrónico', 'email', 'email', 'email-address')}
          {renderInput('Documento', 'documento', 'card-account-details', 'numeric')}
          {renderInput('Número de teléfono', 'numero', 'phone', 'phone-pad')}
          {renderInput('Contraseña', 'password', 'lock', 'default', true)}
          {renderInput('Fecha de nacimiento', 'fechaNacimiento', 'calendar')}

          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Registrarse</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        modal
        open={openDate}
        date={form.fechaNacimiento}
        mode="date"
        maximumDate={new Date()}
        onConfirm={(date) => {
          setOpenDate(false);
          handleChange('fechaNacimiento', date);
        }}
        onCancel={() => setOpenDate(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 35, 
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    marginBottom: 20, 
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#34495e',
  },
  btn: {
    backgroundColor: '#fff', 
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#2E86C1', 
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
});
