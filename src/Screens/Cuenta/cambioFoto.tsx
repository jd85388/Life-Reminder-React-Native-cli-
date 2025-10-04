import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const CambiarFotoScreen: React.FC = () => {
  const navigation = useNavigation();
  const [foto, setFoto] = useState<string | null>(null);

  const tomarFoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert('Error', 'No se pudo acceder a la cámara.');
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (uri) setFoto(uri);
  };

  const guardarFoto = () => {
    if (!foto) {
      Alert.alert('Sin foto', 'Primero toma una foto.');
      return;
    }
    // Aquí guardarías la foto en tu backend o estado global
    Alert.alert('Foto guardada', 'La foto de perfil se actualizó.');
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../assets/imagen/fondo2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Cambiar Foto de Perfil</Text>

        <View style={styles.imageContainer}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.image} />
          ) : (
            <Icon name="account-circle" size={150} color="#fff" />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={tomarFoto}>
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={guardarFoto}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default CambiarFotoScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 25,
  },
  imageContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 100,
    width: 180,
    height: 180,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
  },
  button: {
    width: '70%',
    paddingVertical: 14,
    marginVertical: 10,
    borderRadius: 25,
    backgroundColor: '#fff',        // botones en blanco
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e53935',     // botón Cancelar en rojo
  },
  cancelButtonText: {
    color: '#fff',                  // texto blanco para que contraste
    fontSize: 16,
    fontWeight: '600',
  },
});
