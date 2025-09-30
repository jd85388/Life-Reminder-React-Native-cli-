// src/Screens/ConsultasScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ConsultaService, { Consulta } from '../services/ConsultaService';
import AnimacionElement from '../components/AnimacionElement';

export default function ConsultasScreen() {
  const [consultasProximas, setConsultasProximas] = useState<Consulta[]>([]);
  const [historialConsultas, setHistorialConsultas] = useState<Consulta[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabActivo, setTabActivo] = useState<'proximas' | 'historial'>('proximas');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    cargarConsultas();
  }, []);

  const cargarConsultas = async () => {
    try {
      const [proximas, historial] = await Promise.all([
        ConsultaService.obtenerConsultasProximas(),
        ConsultaService.obtenerHistorialConsultas(),
      ]);

      setConsultasProximas(proximas);
      setHistorialConsultas(historial);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar consultas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarConsultas();
    setRefreshing(false);
  };

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearHora = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerColorPrioridad = (prioridad: string): string => {
    switch (prioridad) {
      case 'alta': return '#EF4444';
      case 'media': return '#F59E0B';
      case 'baja': return '#10B981';
      default: return '#6B7280';
    }
  };

  const manejarCancelarConsulta = (consulta: Consulta) => {
    Alert.alert(
      'Cancelar consulta',
      `¿Estás seguro de que deseas cancelar la consulta con ${consulta.doctor}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConsultaService.cancelarConsulta(consulta._id);
              await cargarConsultas();
              Alert.alert('Éxito', 'Consulta cancelada correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al cancelar consulta');
            }
          }
        }
      ]
    );
  };

  const renderConsulta = (consulta: Consulta, index: number) => (
    <AnimacionElement key={consulta._id} duration={500 + (index * 100)}>
      <View style={styles.consultaCard}>
        <View style={styles.consultaHeader}>
          <View style={styles.consultaInfo}>
            <Text style={styles.doctorNombre}>{consulta.doctor}</Text>
            <Text style={styles.especialidad}>{consulta.especialidad}</Text>
          </View>
          <View style={[styles.prioridadBadge, { backgroundColor: obtenerColorPrioridad(consulta.prioridad) }]}>
            <Text style={styles.prioridadText}>{consulta.prioridad.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.consultaDetalles}>
          <View style={styles.detalleRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleText}>{formatearFecha(consulta.fecha)}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleText}>{formatearHora(consulta.fecha)}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleText}>{consulta.direccion}</Text>
          </View>
        </View>

        <Text style={styles.motivoText}>{consulta.motivo}</Text>

        {consulta.observacion && (
          <View style={styles.observacionContainer}>
            <Text style={styles.observacionLabel}>Observaciones:</Text>
            <Text style={styles.observacionText}>{consulta.observacion}</Text>
          </View>
        )}

        {tabActivo === 'proximas' && (
          <View style={styles.accionesContainer}>
            <TouchableOpacity
              style={styles.botonCancelar}
              onPress={() => manejarCancelarConsulta(consulta)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={styles.botonCancelarText}>Cancelar</Text>
            </TouchableOpacity>
            
            {consulta.recordatorio && (
              <View style={styles.recordatorioIndicador}>
                <Ionicons name="notifications-outline" size={16} color="#3B82F6" />
                <Text style={styles.recordatorioText}>Recordatorio activo</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </AnimacionElement>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Consultas</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'proximas' && styles.tabActivo]}
          onPress={() => setTabActivo('proximas')}
        >
          <Text style={[styles.tabText, tabActivo === 'proximas' && styles.tabTextActivo]}>
            Próximas ({consultasProximas.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'historial' && styles.tabActivo]}
          onPress={() => setTabActivo('historial')}
        >
          <Text style={[styles.tabText, tabActivo === 'historial' && styles.tabTextActivo]}>
            Historial ({historialConsultas.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tabActivo === 'proximas' ? (
          consultasProximas.length > 0 ? (
            consultasProximas.map((consulta, index) => renderConsulta(consulta, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No tienes consultas próximas</Text>
              <Text style={styles.emptySubtitle}>Programa una nueva cita médica</Text>
            </View>
          )
        ) : (
          historialConsultas.length > 0 ? (
            historialConsultas.map((consulta, index) => renderConsulta(consulta, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Sin historial de consultas</Text>
              <Text style={styles.emptySubtitle}>Tu historial aparecerá aquí</Text>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActivo: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActivo: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  consultaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  consultaInfo: {
    flex: 1,
  },
  doctorNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  especialidad: {
    fontSize: 14,
    color: '#6B7280',
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  prioridadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  consultaDetalles: {
    marginBottom: 12,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detalleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  motivoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  observacionContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  observacionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  observacionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  accionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  botonCancelar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  botonCancelarText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  recordatorioIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordatorioText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#3B82F6',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});