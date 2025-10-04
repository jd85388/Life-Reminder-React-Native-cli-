import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ContactarSoporteScreen() {
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const opcionesAsunto = [
    { label: 'Seleccione un asunto', value: '' },
    { label: 'Problemas de inicio de sesión', value: 'Problemas de inicio de sesión' },
    { label: 'Error en notificaciones', value: 'Error en notificaciones' },
    { label: 'Sugerencias de mejora', value: 'Sugerencias de mejora' },
    { label: 'Otro', value: 'Otro' },
  ];

  const enviarCorreo = () => {
    if (!asunto || !mensaje) {
      Alert.alert('Campos incompletos', 'Selecciona un asunto y escribe tu mensaje.');
      return;
    }

    const correo = 'soporte@lifereminder.com'; // Cambia a tu correo real
    const subject = encodeURIComponent(asunto);
    const body = encodeURIComponent(mensaje);

    Linking.openURL(`mailto:${correo}?subject=${subject}&body=${body}`);
  };

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Contactar Soporte</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={asunto}
            onValueChange={(itemValue) => setAsunto(itemValue)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            {opcionesAsunto.map((op) => (
              <Picker.Item key={op.value} label={op.label} value={op.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#ccc"
          value={mensaje}
          onChangeText={setMensaje}
        />

        <TouchableOpacity style={styles.button} onPress={enviarCorreo}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginBottom: 20,
  },
  picker: {
    color: '#fff',
    width: '100%',
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 15,
    fontSize: 16,
    marginBottom: 25,
    color: '#000',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#0e7fc0',
    fontSize: 18,
    fontWeight: '600',
  },
});
