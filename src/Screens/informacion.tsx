import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InfoLifeReminder() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        {/* LOGO */}
        <Image
          source={require('../assets/imagen/logoLife.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* SECCIÓN: Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué es Life Reminder?</Text>
          <Text style={styles.sectionText}>
            Life Reminder es una aplicación diseñada para ayudarte a
            organizar tu salud: agenda de citas médicas, recordatorio de
            medicamentos y control de tratamientos, todo en un solo lugar.
          </Text>
        </View>

        {/* SECCIÓN: Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <Text style={styles.sectionText}>
            Correo: soporteLifeReminder@gmail.com
          </Text>
          <Text style={styles.sectionText}>Teléfono: +57 3229228590</Text>
        </View>

        {/* SECCIÓN: Más información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Más Información</Text>
          <Text style={styles.sectionText}>
            • Recordatorios de medicamentos personalizados{'\n'}
            • Agenda de citas médicas{'\n'}
            • Reportes para tu médico
          </Text>
        </View>

        {/* Políticas y Versión */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              // Aquí puedes abrir una pantalla o enlace de Políticas
            }}
          >
            <Text style={styles.privacyLink}>Políticas de Privacidad</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Versión 1.0.3</Text>
        </View>

        {/* Botón Volver */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 10,
  },
  section: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0e7fc0',
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  privacyLink: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    color: '#fff',
  },
  button: {
    marginTop: 30,
    width: '70%',
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
