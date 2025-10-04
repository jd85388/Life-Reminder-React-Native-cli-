import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EnhancedNotificationService from '../services/EnhancedNotificationService';
import MedicamentoService, { CrearMedicamentoData } from '../services/MedicamentoService';

export default function RegistroMedicamentoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [via, setVia] = useState('');

  const handleRegistro = async () => {
    if (!nombre || !dosis || !frecuencia || !via) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    try {
      // Crear objeto medicamento
      const nuevoMedicamento: CrearMedicamentoData = {
        nombre,
        dosis: parseFloat(dosis) || 0,
        unidad: 'mg', // Por defecto, se puede hacer dinámico después
        frecuencia,
        viaAdministracion: via,
        duracion: {
          inicio: new Date(),
          fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días por defecto
        },
        recetadoPor: 'Doctor',
        descripcion: 'Medicamento registrado desde la app',
        causaUso: 'Tratamiento',
      };

      // Registrar medicamento en el backend
      const medicamentoRegistrado = await MedicamentoService.crearMedicamento(nuevoMedicamento);
      
      // Programar notificaciones automáticamente
      await EnhancedNotificationService.scheduleNotificationsForMedication(medicamentoRegistrado);
      
      Alert.alert(
        '✅ Éxito', 
        'Medicamento registrado correctamente y recordatorios programados.',
        [
          {
            text: 'Ver Configuración',
            onPress: () => navigation.navigate('Settings'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      
    } catch (error) {
      console.error('Error registrando medicamento:', error);
      Alert.alert('Error', 'No se pudo registrar el medicamento. Intente nuevamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#0F766E']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Medicamento</Text>
      </LinearGradient>
      <KeyboardAwareScrollView>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Detalles del Medicamento</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="medical-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del Medicamento"
                placeholderTextColor="#9CA3AF"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="eyedrop-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Dosis (ej: 500 mg)"
                placeholderTextColor="#9CA3AF"
                value={dosis}
                onChangeText={setDosis}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Frecuencia (ej: Cada 8 horas)"
                placeholderTextColor="#9CA3AF"
                value={frecuencia}
                onChangeText={setFrecuencia}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="body-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Vía de Administración"
                placeholderTextColor="#9CA3AF"
                value={via}
                onChangeText={setVia}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
              <LinearGradient colors={['#10B981', '#0F766E']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Registrar Medicamento</Text>
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
