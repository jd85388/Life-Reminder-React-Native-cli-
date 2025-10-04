// src/Screens/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RutasRootStackParamList } from '../../navigation/navegacionVistas'; 
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import AnimacionElement from '../../components/AnimacionElement';

const { width } = Dimensions.get('window');

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  screen: keyof RutasRootStackParamList;
  count?: number;
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    proximasConsultas: 0,
    medicamentosActivos: 0,
    tratamientosEnCurso: 0,
    recordatoriosPendientes: 0,
  });

  const { user, logout } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RutasRootStackParamList>>();

  const dashboardCards: DashboardCard[] = [
    {
      id: '1',
      title: 'Consultas',
      subtitle: 'Próximas citas médicas',
      icon: 'calendar-outline',
      color: '#3B82F6',
      screen: 'Consultas',
      count: dashboardData.proximasConsultas,
    },
    {
      id: '2',
      title: 'Medicamentos',
      subtitle: 'Medicamentos activos',
      icon: 'medical-outline',
      color: '#10B981',
      screen: 'Medicamentos',
      count: dashboardData.medicamentosActivos,
    },
    {
      id: '3',
      title: 'Tratamientos',
      subtitle: 'En curso',
      icon: 'fitness-outline',
      color: '#F59E0B',
      screen: 'Home',
      count: dashboardData.tratamientosEnCurso,
    },
    {
      id: '4',
      title: 'Recordatorios',
      subtitle: 'Pendientes hoy',
      icon: 'notifications-outline',
      color: '#EF4444',
      screen: 'Recordatorios',
      count: dashboardData.recordatoriosPendientes,
    },
  ];

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      // Aquí harías las llamadas a tus APIs para obtener los datos
      // Por ahora uso datos de ejemplo
      setDashboardData({
        proximasConsultas: 2,
        medicamentosActivos: 3,
        tratamientosEnCurso: 1,
        recordatoriosPendientes: 5,
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatosDashboard();
    setRefreshing(false);
  };

  const handleCardPress = (screen: keyof RutasRootStackParamList) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const formatearFecha = () => {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return hoy.toLocaleDateString('es-ES', opciones);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Image
              source={require('../../assets/imagen/logoIcon.png')}
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <AnimacionElement duration={1000}>
                <Text style={styles.welcomeText}>¡Hola!</Text>
              </AnimacionElement>
              <AnimacionElement duration={1500}>
                <Text style={styles.userName}>
                  {user?.nombre} {user?.apellido}
                </Text>
              </AnimacionElement>
            </View>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('ConfiguracionPerfil')} 
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <AnimacionElement duration={2000}>
          <Text style={styles.dateText}>{formatearFecha()}</Text>
        </AnimacionElement>
      </LinearGradient>

      {/* Contenido Principal */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Saludo personalizado */}
        <AnimacionElement duration={1500}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTitle}>Tu salud, nuestra prioridad</Text>
            <Text style={styles.greetingSubtitle}>
              Mantén el control de tus medicamentos y citas médicas
            </Text>
          </View>
        </AnimacionElement>

        {/* Grid de Cards */}
        <View style={styles.cardsGrid}>
          {dashboardCards.map((card, index) => (
            <AnimacionElement key={card.id} duration={1000 + (index * 200)}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleCardPress(card.screen)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[card.color, `${card.color}DD`]}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <Ionicons name={card.icon as any} size={28} color="#fff" />
                    {card.count !== undefined && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{card.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </AnimacionElement>
          ))}
        </View>

        {/* Sección de acceso rápido */}
        <AnimacionElement duration={2000}>
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Acceso Rápido</Text>
            
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Registrar nueva toma</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Registros')}
            >
              <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Ver historial médico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="person-outline" size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </AnimacionElement>

        {/* Espacio inferior */}
        <View style={styles.bottomSpace} />
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
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#E5F3FF',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dateText: {
    fontSize: 14,
    color: '#E5F3FF',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 50) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 20,
    height: 120,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  quickActionsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quickActionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  bottomSpace: {
    height: 20,
  },
});