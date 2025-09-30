// src/Screens/MedicamentosScreen.tsx
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MedicamentoService, { Medicamento } from '../services/MedicamentoService';
import AnimacionElement from '../components/AnimacionElement';

export default function MedicamentosScreen() {
  const [medicamentosActivos, setMedicamentosActivos] = useState<Medicamento[]>([]);
  const [medicamentosFinalizados, setMedicamentosFinalizados] = useState<Medicamento[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tabActivo, setTabActivo] = useState<'activos' | 'finalizados'>('activos');
  const [modalVisible, setModalVisible] = useState(false);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState<Medicamento | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      const [activos, todos] = await Promise.all([
        MedicamentoService.obtenerMedicamentosActivos(),
        MedicamentoService.obtenerMedicamentos(),
      ]);

      const finalizados = todos.filter(med => {
        const fechaFin = new Date(med.duracion.fin);
        const hoy = new Date();
        return !med.estado || fechaFin < hoy;
      });

      setMedicamentosActivos(activos);
      setMedicamentosFinalizados(finalizados);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar medicamentos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarMedicamentos();
    setRefreshing(false);
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const obtenerColorVia = (via: string): string => {
    const colores: { [key: string]: string } = {
      'oral': '#10B981',
      'intravenosa': '#EF4444',
      'intramuscular': '#F59E0B',
      'subcutanea': '#8B5CF6',
      'topica': '#06B6D4',
      'inhalatoria': '#EC4899',
    };
    return colores[via.toLowerCase()] || '#6B7280';
  };

  const manejarRegistrarToma = async (medicamento: Medicamento) => {
    try {
      await MedicamentoService.registrarToma(medicamento._id, new Date());
      Alert.alert('Éxito', 'Toma registrada correctamente');
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar toma');
    }
  };

  const manejarDesactivarMedicamento = (medicamento: Medicamento) => {
    Alert.alert(
      'Desactivar medicamento',
      `¿Estás seguro de que deseas desactivar ${medicamento.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desactivar',
          style: 'destructive',
          onPress: async () => {
            try {
              await MedicamentoService.desactivarMedicamento(medicamento._id);
              await cargarMedicamentos();
              Alert.alert('Éxito', 'Medicamento desactivado');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al desactivar medicamento');
            }
          }
        }
      ]
    );
  };

  const abrirDetallesMedicamento = (medicamento: Medicamento) => {
    setMedicamentoSeleccionado(medicamento);
    setModalVisible(true);
  };

  const obtenerProximaToma = (medicamento: Medicamento): string => {
    const proximaToma = MedicamentoService.obtenerProximaToma(medicamento);
    if (!proximaToma) return 'No programada';
    
    return proximaToma.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMedicamento = (medicamento: Medicamento, index: number) => (
    <AnimacionElement key={medicamento._id} duration={500 + (index * 100)}>
      <TouchableOpacity
        style={styles.medicamentoCard}
        onPress={() => abrirDetallesMedicamento(medicamento)}
        activeOpacity={0.8}
      >
        <View style={styles.medicamentoHeader}>
          <View style={styles.medicamentoInfo}>
            <Text style={styles.medicamentoNombre}>{medicamento.nombre}</Text>
            <Text style={styles.medicamentoDosis}>
              {medicamento.dosis} {medicamento.unidad} - {medicamento.frecuencia}
            </Text>
          </View>
          <View style={[styles.viaBadge, { backgroundColor: obtenerColorVia(medicamento.viaAdministracion) }]}>
            <Text style={styles.viaText}>{medicamento.viaAdministracion.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.medicamentoDetalles}>
          <View style={styles.detalleRow}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleText}>Dr. {medicamento.recetadoPor}</Text>
          </View>
          <View style={styles.detalleRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detalleText}>
              {formatearFecha(medicamento.duracion.inicio)} - {formatearFecha(medicamento.duracion.fin)}
            </Text>
          </View>
          {tabActivo === 'activos' && (
            <View style={styles.detalleRow}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.detalleText}>Próxima toma: {obtenerProximaToma(medicamento)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.causaUso}>{medicamento.causaUso}</Text>

        {tabActivo === 'activos' && (
          <View style={styles.accionesContainer}>
            <TouchableOpacity
              style={styles.botonToma}
              onPress={(e) => {
                e.stopPropagation();
                manejarRegistrarToma(medicamento);
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              <Text style={styles.botonTomaText}>Registrar toma</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.botonDesactivar}
              onPress={(e) => {
                e.stopPropagation();
                manejarDesactivarMedicamento(medicamento);
              }}
            >
              <Ionicons name="stop-circle-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </AnimacionElement>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Header */}
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Medicamentos</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'activos' && styles.tabActivo]}
          onPress={() => setTabActivo('activos')}
        >
          <Text style={[styles.tabText, tabActivo === 'activos' && styles.tabTextActivo]}>
            Activos ({medicamentosActivos.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActivo === 'finalizados' && styles.tabActivo]}
          onPress={() => setTabActivo('finalizados')}
        >
          <Text style={[styles.tabText, tabActivo === 'finalizados' && styles.tabTextActivo]}>
            Finalizados ({medicamentosFinalizados.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tabActivo === 'activos' ? (
          medicamentosActivos.length > 0 ? (
            medicamentosActivos.map((medicamento, index) => renderMedicamento(medicamento, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No tienes medicamentos activos</Text>
              <Text style={styles.emptySubtitle}>Agrega un nuevo medicamento</Text>
            </View>
          )
        ) : (
          medicamentosFinalizados.length > 0 ? (
            medicamentosFinalizados.map((medicamento, index) => renderMedicamento(medicamento, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="archive-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Sin medicamentos finalizados</Text>
              <Text style={styles.emptySubtitle}>Tu historial aparecerá aquí</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {medicamentoSeleccionado && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{medicamentoSeleccionado.nombre}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Dosificación</Text>
                    <Text style={styles.modalText}>
                      {medicamentoSeleccionado.dosis} {medicamentoSeleccionado.unidad}
                    </Text>
                    <Text style={styles.modalText}>Frecuencia: {medicamentoSeleccionado.frecuencia}</Text>
                    <Text style={styles.modalText}>Vía: {medicamentoSeleccionado.viaAdministracion}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Tratamiento</Text>
                    <Text style={styles.modalText}>Inicio: {formatearFecha(medicamentoSeleccionado.duracion.inicio)}</Text>
                    <Text style={styles.modalText}>Fin: {formatearFecha(medicamentoSeleccionado.duracion.fin)}</Text>
                    <Text style={styles.modalText}>Recetado por: Dr. {medicamentoSeleccionado.recetadoPor}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Descripción</Text>
                    <Text style={styles.modalDescription}>{medicamentoSeleccionado.descripcion}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Indicación</Text>
                    <Text style={styles.modalDescription}>{medicamentoSeleccionado.causaUso}</Text>
                  </View>

                  {medicamentoSeleccionado.notas && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Notas adicionales</Text>
                      <Text style={styles.modalDescription}>{medicamentoSeleccionado.notas}</Text>
                    </View>
                  )}
                </ScrollView>

                {tabActivo === 'activos' && (
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => manejarRegistrarToma(medicamentoSeleccionado)}
                  >
                    <Text style={styles.modalButtonText}>Registrar toma</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#10B981',
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
  medicamentoCard: {
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
  medicamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicamentoInfo: {
    flex: 1,
  },
  medicamentoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  medicamentoDosis: {
    fontSize: 14,
    color: '#6B7280',
  },
  viaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  medicamentoDetalles: {
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
  causaUso: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  accionesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  botonToma: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    flex: 1,
    marginRight: 8,
  },
  botonTomaText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  botonDesactivar: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});