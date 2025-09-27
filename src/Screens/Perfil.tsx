import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';

export default function ConfiguracionPerfil({ navigation }: any) {
  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('cambioFoto')}>
          <Text style={styles.buttonText}>Cambiar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('cambioDatos')}>
          <Text style={styles.buttonText}>Cambiar Datos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('configurarApp')}>
          <Text style={styles.buttonText}>Configuracion de la app</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('cambioContrasena')}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('contactoSoporte')}>
          <Text style={styles.buttonText}>Contactar a Soporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('informacion')}>
          <Text style={styles.buttonText}>Información de Life Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#fff',
  },
  button: {
    width: '85%',
    paddingVertical: 16,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#0e7fc0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    marginTop: 20,
  },
});
