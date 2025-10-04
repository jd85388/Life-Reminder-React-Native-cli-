import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ConfiguracionAppScreen() {
  const [idioma, setIdioma] = useState('es');
  const [notificaciones, setNotificaciones] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(false);

  const guardarCambios = () => {
    // Aquí podrías guardar en AsyncStorage o en tu backend
    console.log({
      idioma,
      notificaciones,
      modoOscuro,
    });
  };

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Configuración de la App</Text>

        {/* Selector de idioma */}
        <View style={styles.section}>
          <Text style={styles.label}>Idioma</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={idioma}
              onValueChange={(value) => setIdioma(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Español" value="es" />
              <Picker.Item label="Inglés" value="en" />
              <Picker.Item label="Francés" value="fr" />
            </Picker>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.label}>Notificaciones</Text>
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
            thumbColor={notificaciones ? '#0e7fc0' : '#ccc'}
            trackColor={{ true: '#80c8e8', false: '#888' }}
          />
        </View>

        {/* Modo oscuro */}
        <View style={styles.section}>
          <Text style={styles.label}>Modo oscuro</Text>
          <Switch
            value={modoOscuro}
            onValueChange={setModoOscuro}
            thumbColor={modoOscuro ? '#0e7fc0' : '#ccc'}
            trackColor={{ true: '#80c8e8', false: '#888' }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={guardarCambios}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 20,
  },
  picker: {
    color: '#fff',
    width: '100%',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#0e7fc0',
    fontSize: 18,
    fontWeight: '600',
  },
});
