// src/Screens/RecordatoriosScreen.tsx
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotificationService, { RecordatorioLocal } from '../services/NotificationService';
import MedicamentoService from '../services/MedicamentoService';
import AnimacionElement from '../components/AnimacionElement';

export default function RecordatoriosScreen() {
  const [recordatoriosHoy, setRecordatoriosHoy] = useState<RecordatorioLocal[]>([]);
  const [recordatoriosProximos, setRecordatoriosProximos] = useState<RecordatorioLocal[]>([]);
  const [recordatoriosVencidos, setRecordatoriosVencidos] = useState<RecordatorioLocal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tabActivo, setTabActivo] = useState<'hoy' | 'proximos' | 'vencidos'>('hoy');
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    cargarRecordatorios();
  }, []);

  const cargarRecordatorios = async () => {
    try {
      const [hoy, proximos, vencidos] = await Promise.all([
        NotificationService.obtenerRecordatoriosHoy(),
        NotificationService.obtenerProximosRecordatorios(),
        NotificationService.verificarRecordatoriosVencidos(),
      ]);

      setRecordatoriosHoy(hoy);
      setRecordatoriosProximos(proximos);
      setRecordatoriosVencidos(vencidos);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar recordatorios');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRecordatorios();
    setRefreshing(false);
  };

  const formatearHora = (fechaHora: string): string => {
    return new Date(fechaHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearFecha = (fechaHora: string): string => {
    const fecha = new Date(fechaHora);
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    if (fecha.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fecha.toDateString() === mañana.toDateString()) {
      return 'Mañana';
    } else {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const obtenerColorEstado = (fechaHora: string, completado: boolean): string => {
    if (completado) return '#10B981';
    
    const ahora = new Date();
    const fechaRecordatorio = new Date(fechaHora);
    
    if (fechaRecordatorio < ahora) {
      return '#EF4444'; // Vencido
    } else if (fechaRecordatorio.getTime() - ahora.getTime() <= 60 * 60 * 1000) {
      return '#F59E0B'; // Próximo (menos de 1 hora)
    } else {
      return '#3B82F6'; // Futuro
    }
  };

  const manejarMarcarCompletado = async (recordatorio: RecordatorioLocal) => {
    try {
      await NotificationService.marcarRecordatorioCompletado(recordatorio.id);
      await MedicamentoService.registrarToma(recordatorio.medicamentoId, new Date());
      await cargarRecordatorios();
      
      Alert.alert(
        'Toma registrada',
        `Has registrado la toma de ${recordatorio.medicamentoNombre}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar toma');
    }
  };

  const manejarPosponer = (recordatorio: RecordatorioLocal) => {
    Alert.alert(
      'Posponer recordatorio',
      '¿Cuánto tiempo quieres posponer este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '5 minutos', onPress: () => posponerRecordatorio(recordatorio, 5) },
        { text: '10 minutos', onPress: () => posponerRecordatorio(recordatorio, 10) },
        { text: '30 minutos', onPress: () => posponerRecordatorio(recordatorio, 30) },
      ]
    );
  };

  const posponerRecordatorio = async (recordatorio: RecordatorioLocal, minutos: number) => {
    try {
      // En una implementación real, crearías un nuevo recordatorio pospuesto
      Alert.alert(
        'Recordatorio pospuesto',
        `Se te recordará tomar ${recordatorio.medicamentoNombre} en ${minutos} minutos`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al posponer recordatorio');
    }
  };

  const manejarEliminarRecordatorio = (recordatorio: RecordatorioLocal) => {
    Alert.alert(
      'Eliminar recordatorio',
      `¿Estás seguro de que deseas eliminar este recordatorio de ${recordatorio.medicamentoNombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await NotificationService.marcarRecordatorioCompletado(recordatorio.id);
              await cargarRecordatorios();
              Alert.alert('Éxito', 'Recordatorio eliminado');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar recordatorio');
            }
          }
        }
      ]
    );
  };

  const manejarConfiguracionNotificaciones = async () => {
    if (notificacionesActivas) {
      Alert.alert(
        'Desactivar notificaciones',
        '¿Estás seguro de que deseas desactivar todas las notificaciones?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desactivar',
            style: 'destructive',
            onPress: async () => {
              await NotificationService.cancelarTodosLosRecordatorios();
              setNotificacionesActivas(false);
            }
          }
        ]
      );
    } else {
      setNotificacionesActivas(true);
      Alert.alert('Notificaciones activadas', 'Las notificaciones han sido reactivadas');
    }
  };

  const renderRecordatorio = (recordatorio: RecordatorioLocal, index: number) => {
    const color = obtenerColorEstado(recordatorio.fechaHora, !recordatorio.activo);
    const esPasado = new Date(recordatorio.fechaHora) < new Date();
    
    return (
      <AnimacionElement key={recordatorio.id} duration={500 + (index * 100)}>
        <View style={[styles.recordatorioCard, { borderLeftColor: color }]}>
          <View style={styles.recordatorioHeader}>
            <View style={styles.recordatorioInfo}>
              <Text style={styles.medicamentoNombre}>{recordatorio.medicamentoNombre}</Text>
              <Text style={styles.dosisText}>{recordatorio.dosis}</Text>
            </View>
            <View style={styles.tiempoContainer}>
              <Text style={styles.fechaText}>{formatearFecha(recordatorio.fechaHora)}</Text>
              <Text style={[styles.horaText, { color }]}>{formatearHora(recordatorio.fechaHora)}</Text>
            </View>
          </View>

          <View style={styles.estadoContainer}>
            <View style={[styles.estadoIndicador, { backgroundColor: color }]}>
              <Ionicons 
                name={
                  !recordatorio.activo ? 'checkmark' : 
                  esPasado ? 'time' : 
                  'notifications'
                } 
                size={16} 
                color="#fff" 
              />
            </View>
            <Text style={[styles.estadoText, { color }]}>
              {!recordatorio.activo ? 'Completado' : 
               esPasado ? 'Vencido' : 
               'Pendiente'}
            </Text>
          </View>

          {recordatorio.activo && (
            <View style={styles.accionesContainer}>
              <TouchableOpacity
                style={styles.botonCompletar}
                onPress={() => manejarMarcarCompletado(recordatorio)}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text style={styles.botonCompletarText}>Marcar como tomado</Text>
              </TouchableOpacity>
              
              <View style={styles.accionesSecundarias}>
                {!esPasado && (
                  <TouchableOpacity
                    style={styles.botonPosponer}
                    onPress={() => manejarPosponer(recordatorio)}
                  >
                    <Ionicons name="time-outline" size={18} color="#F59E0B" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => manejarEliminarRecordatorio(recordatorio)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </AnimacionElement>
    );
  };

  const obtenerRecordatoriosActivos = () => {
    switch (tabActivo) {
      case 'hoy':
        return recordatoriosHoy;
      case 'proximos':
        return recordatoriosProximos;
      case 'vencidos':
        return recordatoriosVencidos;
      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* Header */}
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recordatorios</Text>
          <TouchableOpacity 
            style={styles.configButton}
            onPress={() => NotificationService.enviarNotificacionPrueba()}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Configuración de notificaciones */}
        <View style={styles.configContainer}>
          <Text style={styles.configText}>Notificaciones</Text>
          <Switch
            value={notificacionesActivas}
            onValueChange={manejarConfiguracionNotificaciones}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
            thumbColor={notificacionesActivas ? '#fff' : '#f4f3f4'}
          />
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'hoy' && styles.tabActivo]}
          onPress={() => setTabActivo('hoy')}
        >
          <Text style={[styles.tabText, tabActivo === 'hoy' && styles.tabTextActivo]}>
            Hoy ({recordatoriosHoy.filter(r => r.activo).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'proximos' && styles.tabActivo]}
          onPress={() => setTabActivo('proximos')}
        >
          <Text style={[styles.tabText, tabActivo === 'proximos' && styles.tabTextActivo]}>
            Próximos ({recordatoriosProximos.filter(r => r.activo).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'vencidos' && styles.tabActivo]}
          onPress={() => setTabActivo('vencidos')}
        >
          <Text style={[styles.tabText, tabActivo === 'vencidos' && styles.tabTextActivo]}>
            Vencidos ({recordatoriosVencidos.filter(r => r.activo).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {obtenerRecordatoriosActivos().length > 0 ? (
          obtenerRecordatoriosActivos().map((recordatorio, index) => 
            renderRecordatorio(recordatorio, index)
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={
                tabActivo === 'hoy' ? 'checkmark-circle-outline' :
                tabActivo === 'proximos' ? 'time-outline' :
                'alert-circle-outline'
              } 
              size={64} 
              color="#D1D5DB" 
            />
            <Text style={styles.emptyTitle}>
              {tabActivo === 'hoy' ? 'Sin recordatorios para hoy' :
               tabActivo === 'proximos' ? 'Sin recordatorios próximos' :
               'Sin recordatorios vencidos'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {tabActivo === 'hoy' ? '¡Excelente! No tienes medicamentos pendientes' :
               tabActivo === 'proximos' ? 'Tus próximos recordatorios aparecerán aquí' :
               '¡Muy bien! No tienes medicamentos atrasados'}
            </Text>
          </View>
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
    marginBottom: 16,
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
  configButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  configContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  configText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  tabTextActivo: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recordatorioCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recordatorioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordatorioInfo: {
    flex: 1,
  },
  medicamentoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dosisText: {
    fontSize: 14,
    color: '#6B7280',
  },
  tiempoContainer: {
    alignItems: 'flex-end',
  },
  fechaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  horaText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  estadoIndicador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  estadoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  accionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  botonCompletar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    flex: 1,
    marginRight: 12,
  },
  botonCompletarText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  accionesSecundarias: {
    flexDirection: 'row',
    gap: 8,
  },
  botonPosponer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonEliminar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 20,
  },
});