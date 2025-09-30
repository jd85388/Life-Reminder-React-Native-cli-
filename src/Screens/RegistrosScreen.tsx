// src/Screens/RegistrosScreen.tsx
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
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimacionElement from '../components/AnimacionElement';
import RegistroService, { RegistroMedico, ResumenSalud } from '../services/RegistroService';

export default function RegistrosScreen() {
  const [registros, setRegistros] = useState<RegistroMedico[]>([]);
  const [registrosFiltrados, setRegistrosFiltrados] = useState<RegistroMedico[]>([]);
  const [resumenSalud, setResumenSalud] = useState<ResumenSalud>({
    totalRegistros: 0,
    consultasUltimoMes: 0,
    medicamentosActivos: 0,
    proximasCitas: 0,
    alertasSalud: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [_loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [_modalFiltros, setModalFiltros] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroMedico | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const tiposRegistro = [
    { value: 'todos', label: 'Todos', icon: 'grid-outline', color: '#6B7280' },
    { value: 'consulta', label: 'Consultas', icon: 'calendar-outline', color: '#3B82F6' },
    { value: 'medicamento', label: 'Medicamentos', icon: 'medical-outline', color: '#10B981' },
    { value: 'tratamiento', label: 'Tratamientos', icon: 'fitness-outline', color: '#F59E0B' },
    { value: 'examen', label: 'Exámenes', icon: 'document-text-outline', color: '#8B5CF6' },
    { value: 'emergencia', label: 'Emergencias', icon: 'warning-outline', color: '#EF4444' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const filtrarRegistros = React.useCallback(() => {
    let registrosFiltradosLocal = registros;

    // Filtrar por tipo
    if (tipoFiltro !== 'todos') {
      registrosFiltradosLocal = registrosFiltradosLocal.filter(registro => registro.tipo === tipoFiltro);
    }

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase().trim();
      registrosFiltradosLocal = registrosFiltradosLocal.filter(registro =>
        registro.titulo.toLowerCase().includes(terminoBusqueda) ||
        registro.descripcion.toLowerCase().includes(terminoBusqueda) ||
        registro.medico?.nombre.toLowerCase().includes(terminoBusqueda) ||
        registro.diagnostico?.toLowerCase().includes(terminoBusqueda)
      );
    }

    // Ordenar por fecha más reciente
    registrosFiltradosLocal.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    setRegistrosFiltrados(registrosFiltradosLocal);
  }, [registros, busqueda, tipoFiltro]);

  useEffect(() => {
    filtrarRegistros();
  }, [filtrarRegistros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [historialResponse, resumenResponse] = await Promise.all([
        RegistroService.obtenerHistorialMedico(),
        RegistroService.obtenerResumenSalud(),
      ]);

      setRegistros(historialResponse);
      setResumenSalud(resumenResponse);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar registros médicos');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const manejarVerDetalle = (registro: RegistroMedico) => {
    setRegistroSeleccionado(registro);
    setModalDetalle(true);
  };

  const manejarEliminar = (registro: RegistroMedico) => {
    Alert.alert(
      'Eliminar registro',
      `¿Estás seguro de que deseas eliminar "${registro.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await RegistroService.eliminarRegistro(registro._id);
              await cargarDatos();
              Alert.alert('Éxito', 'Registro eliminado correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar registro');
            }
          }
        }
      ]
    );
  };

  const obtenerColorPrioridad = (prioridad: string): string => {
    const colores = {
      baja: '#10B981',
      media: '#F59E0B',
      alta: '#EF4444',
      urgente: '#DC2626',
    };
    return colores[prioridad as keyof typeof colores] || '#6B7280';
  };

  const formatearFecha = (fecha: string): string => {
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);

    if (fechaObj.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fechaObj.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: fechaObj.getFullYear() !== hoy.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const renderRegistro = ({ item, index }: { item: RegistroMedico; index: number }) => (
    <AnimacionElement duration={300 + (index * 100)}>
      <TouchableOpacity
        style={styles.registroCard}
        onPress={() => manejarVerDetalle(item)}
        activeOpacity={0.8}
      >
        <View style={styles.registroHeader}>
          <View style={styles.registroTipo}>
            <View style={[styles.tipoIcono, { backgroundColor: RegistroService.obtenerColorTipo(item.tipo) }]}>
              <Ionicons name={RegistroService.obtenerIconoTipo(item.tipo) as any} size={16} color="#fff" />
            </View>
            <Text style={styles.tipoText}>{item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</Text>
          </View>
          <View style={styles.registroMeta}>
            <Text style={styles.fechaText}>{formatearFecha(item.fecha)}</Text>
            <View style={[styles.prioridadBadge, { backgroundColor: obtenerColorPrioridad(item.prioridad) }]}>
              <Text style={styles.prioridadText}>{item.prioridad}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.registroTitulo} numberOfLines={2}>{item.titulo}</Text>
        <Text style={styles.registroDescripcion} numberOfLines={3}>{item.descripcion}</Text>

        {item.medico && (
          <View style={styles.medicoInfo}>
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text style={styles.medicoText}>Dr. {item.medico.nombre}</Text>
            {item.medico.especialidad && (
              <Text style={styles.especialidadText}>• {item.medico.especialidad}</Text>
            )}
          </View>
        )}

        <View style={styles.registroFooter}>
          <View style={styles.estadoContainer}>
            <View style={[
              styles.estadoIndicador, 
              item.estado === 'activo' ? styles.estadoActivo : 
              item.estado === 'completado' ? styles.estadoCompletado : styles.estadoInactivo
            ]} />
            <Text style={styles.estadoText}>{item.estado}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.botonEliminar}
            onPress={() => manejarEliminar(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </AnimacionElement>
  );

  const renderModalDetalle = () => (
    <Modal
      visible={modalDetalle}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setModalDetalle(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Detalle del Registro</Text>
          <TouchableOpacity onPress={() => setModalDetalle(false)}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {registroSeleccionado && (
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detalleSection}>
              <Text style={styles.detalleTitulo}>{registroSeleccionado.titulo}</Text>
              <Text style={styles.detalleSubtitulo}>
                {RegistroService.formatearFechaHora(registroSeleccionado.fecha)}
              </Text>
            </View>

            <View style={styles.detalleSection}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.sectionContent}>{registroSeleccionado.descripcion}</Text>
            </View>

            {registroSeleccionado.medico && (
              <View style={styles.detalleSection}>
                <Text style={styles.sectionTitle}>Médico</Text>
                <Text style={styles.sectionContent}>Dr. {registroSeleccionado.medico.nombre}</Text>
                {registroSeleccionado.medico.especialidad && (
                  <Text style={styles.sectionSubcontent}>{registroSeleccionado.medico.especialidad}</Text>
                )}
                {registroSeleccionado.medico.telefono && (
                  <Text style={styles.sectionSubcontent}>Tel: {registroSeleccionado.medico.telefono}</Text>
                )}
              </View>
            )}

            {registroSeleccionado.diagnostico && (
              <View style={styles.detalleSection}>
                <Text style={styles.sectionTitle}>Diagnóstico</Text>
                <Text style={styles.sectionContent}>{registroSeleccionado.diagnostico}</Text>
              </View>
            )}

            {registroSeleccionado.sintomas && registroSeleccionado.sintomas.length > 0 && (
              <View style={styles.detalleSection}>
                <Text style={styles.sectionTitle}>Síntomas</Text>
                {registroSeleccionado.sintomas.map((sintoma, index) => (
                  <Text key={index} style={styles.listItem}>• {sintoma}</Text>
                ))}
              </View>
            )}

            {registroSeleccionado.medicamentos && registroSeleccionado.medicamentos.length > 0 && (
              <View style={styles.detalleSection}>
                <Text style={styles.sectionTitle}>Medicamentos</Text>
                {registroSeleccionado.medicamentos.map((medicamento, index) => (
                  <Text key={index} style={styles.listItem}>• {medicamento}</Text>
                ))}
              </View>
            )}

            {registroSeleccionado.notas && (
              <View style={styles.detalleSection}>
                <Text style={styles.sectionTitle}>Notas adicionales</Text>
                <Text style={styles.sectionContent}>{registroSeleccionado.notas}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* Header */}
      <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registros Médicos</Text>
          <TouchableOpacity style={styles.exportButton} onPress={() => Alert.alert('Próximamente', 'Función de exportar en desarrollo')}>
            <Ionicons name="download-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Resumen rápido */}
        <View style={styles.resumenContainer}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenNumero}>{resumenSalud.totalRegistros}</Text>
            <Text style={styles.resumenLabel}>Total</Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenNumero}>{resumenSalud.consultasUltimoMes}</Text>
            <Text style={styles.resumenLabel}>Este mes</Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenNumero}>{resumenSalud.alertasSalud.length}</Text>
            <Text style={styles.resumenLabel}>Alertas</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Barra de búsqueda y filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar registros..."
            value={busqueda}
            onChangeText={setBusqueda}
            placeholderTextColor="#9CA3AF"
          />
          {busqueda !== '' && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setModalFiltros(true)}
        >
          <Ionicons name="options-outline" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Filtros rápidos */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosContent}
      >
        {tiposRegistro.map((tipo) => (
          <TouchableOpacity
            key={tipo.value}
            style={[
              styles.filtroChip,
              tipoFiltro === tipo.value && { backgroundColor: tipo.color }
            ]}
            onPress={() => setTipoFiltro(tipo.value)}
          >
            <Ionicons 
              name={tipo.icon as any} 
              size={16} 
              color={tipoFiltro === tipo.value ? '#fff' : tipo.color} 
            />
            <Text style={[
              styles.filtroText,
              tipoFiltro === tipo.value ? styles.filtroTextActivo : { color: tipo.color }
            ]}>
              {tipo.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de registros */}
      <FlatList
        data={registrosFiltrados}
        renderItem={renderRegistro}
        keyExtractor={(item) => item._id}
        style={styles.content}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {busqueda || tipoFiltro !== 'todos' ? 'Sin resultados' : 'Sin registros médicos'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {busqueda || tipoFiltro !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Tus registros médicos aparecerán aquí'}
            </Text>
          </View>
        }
      />

      {renderModalDetalle()}
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
    marginBottom: 20,
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
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 16,
  },
  resumenItem: {
    alignItems: 'center',
  },
  resumenNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  resumenLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtrosContainer: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  filtrosContent: {
    paddingRight: 20,
    gap: 8,
  },
  filtroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  registroCard: {
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
  registroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  registroTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipoIcono: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  registroMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  fechaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  prioridadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  registroTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  registroDescripcion: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  medicoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  medicoText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  especialidadText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  registroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estadoIndicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  estadoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  botonEliminar: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detalleSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detalleTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  detalleSubtitulo: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  sectionSubcontent: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  listItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
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
  estadoActivo: {
    backgroundColor: '#10B981',
  },
  estadoCompletado: {
    backgroundColor: '#3B82F6',
  },
  estadoInactivo: {
    backgroundColor: '#6B7280',
  },
  filtroTextActivo: {
    color: '#fff',
  },
});