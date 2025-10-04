// src/Screens/NotificationHistoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import EnhancedNotificationService, { NotificationHistory } from '../services/EnhancedNotificationService';

interface NotificationHistoryScreenProps {
  navigation: any;
}

// Componente EmptyComponent fuera del render
const EmptyComponent: React.FC<{ theme: any; t: (key: string) => string }> = ({ theme }) => (
  <View style={styles.emptyContainer}>
    <Icon name="notifications-off-outline" size={64} color={theme.colors.textSecondary} />
    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
      Sin historial de notificaciones
    </Text>
    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
      Cuando recibas notificaciones de medicamentos, aparecerán aquí
    </Text>
  </View>
);

const NotificationHistoryScreen: React.FC<NotificationHistoryScreenProps> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Función clearHistory removida por no estar en uso

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const historyData = await EnhancedNotificationService.getNotificationHistory();
      // Ordenar por fecha más reciente primero
      const sortedHistory = historyData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error cargando historial:', error);
      Alert.alert(t('error'), 'Error al cargar el historial de notificaciones');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Historial de Notificaciones',
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
    
    loadHistory();
  }, [theme, navigation, loadHistory]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'mostrada': return 'eye-outline';
      case 'tomada': return 'checkmark-circle';
      case 'pospuesta': return 'time-outline';
      case 'ignorada': return 'close-circle';
      default: return 'notifications-outline';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'mostrada': return theme.colors.textSecondary;
      case 'tomada': return theme.colors.success;
      case 'pospuesta': return theme.colors.warning;
      case 'ignorada': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'mostrada': return 'Notificación mostrada';
      case 'tomada': return 'Medicamento tomado';
      case 'pospuesta': return 'Medicamento pospuesto';
      case 'ignorada': return 'Notificación ignorada';
      default: return action;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Hace ${hours} horas`;
    } else {
      return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const renderHistoryItem = ({ item }: { item: NotificationHistory }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.itemHeader}>
        <View style={styles.iconContainer}>
          <Icon
            name={getActionIcon(item.accion)}
            size={24}
            color={getActionColor(item.accion)}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.medicationName, { color: theme.colors.text }]}>
            Medicamento ID: {item.medicamentoId}
          </Text>
          <Text style={[styles.actionText, { color: getActionColor(item.accion) }]}>
            {getActionText(item.accion)}
          </Text>
        </View>
        <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
          Fecha programada: {new Date(item.fechaHora).toLocaleString('es-ES')}
        </Text>
        <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
          ID: {item.id}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Icon name="hourglass-outline" size={48} color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Cargando historial...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        backgroundColor={theme.colors.surface}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyComponent theme={theme} t={t} />}
        refreshing={loading}
        onRefresh={loadHistory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    textAlign: 'right',
  },
  itemDetails: {
    paddingLeft: 52,
  },
  detailText: {
    fontSize: 12,
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationHistoryScreen;