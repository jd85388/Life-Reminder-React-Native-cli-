import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function RegistroConsultaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [especialidad, setEspecialidad] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [lugar, setLugar] = useState('');

  const handleRegistro = async () => {
    if (!especialidad || !doctor || !fecha || !hora || !lugar) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    // Aquí irá la lógica para registrar la consulta en el backend
    console.log({ especialidad, doctor, fecha, hora, lugar });
    Alert.alert('Éxito', 'Consulta registrada correctamente.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Consulta</Text>
      </LinearGradient>
      <KeyboardAwareScrollView>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Detalles de la Consulta</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="git-network-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Especialidad"
                placeholderTextColor="#9CA3AF"
                value={especialidad}
                onChangeText={setEspecialidad}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del Doctor"
                placeholderTextColor="#9CA3AF"
                value={doctor}
                onChangeText={setDoctor}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Fecha (DD/MM/AAAA)"
                placeholderTextColor="#9CA3AF"
                value={fecha}
                onChangeText={setFecha}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hora (HH:MM)"
                placeholderTextColor="#9CA3AF"
                value={hora}
                onChangeText={setHora}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Lugar de la Consulta"
                placeholderTextColor="#9CA3AF"
                value={lugar}
                onChangeText={setLugar}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Registrar Consulta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  content: {
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
