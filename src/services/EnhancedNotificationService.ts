// src/services/EnhancedNotificationService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Medicamento } from './MedicamentoService';

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  badge: boolean;
  snoozeMinutes: number;
  maxSnoozes: number;
}

export interface MedicationNotification {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  dosis: string;
  horario: string;
  fechaHora: Date;
  activo: boolean;
  repeticiones: number;
  sonido?: string;
  prioridad: 'low' | 'normal' | 'high';
}

export interface NotificationHistory {
  id: string;
  medicamentoId: string;
  fechaHora: Date;
  accion: 'mostrada' | 'tomada' | 'pospuesta' | 'ignorada';
  timestamp: Date;
}

class EnhancedNotificationService {
  private static readonly SETTINGS_KEY = 'notification_settings';
  private static readonly NOTIFICATIONS_KEY = 'medication_notifications';
  private static readonly HISTORY_KEY = 'notification_history';
  
  private defaultSettings: NotificationSettings = {
    enabled: true,
    sound: true,
    vibration: true,
    badge: true,
    snoozeMinutes: 5,
    maxSnoozes: 3,
  };

  constructor() {
    this.initializeNotifications();
  }

  // Inicializar configuración de notificaciones
  private async initializeNotifications(): Promise<void> {
    PushNotification.configure({
      onRegister: (token: any) => {
        console.log('Token de notificación:', token);
      },
      onNotification: (notification: any) => {
        console.log('Notificación recibida:', notification);
        this.handleNotificationReceived(notification);
        
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      } as const,
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Crear canal de notificación para Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'medication-reminders',
          channelName: 'Recordatorios de Medicamentos',
          channelDescription: 'Notificaciones para recordar tomar medicamentos',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created: any) => console.log(`Canal creado: ${created}`)
      );
    }
  }

  // Configurar notificaciones para un medicamento
  async scheduleNotificationsForMedication(medicamento: Medicamento): Promise<void> {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled) {
      console.log('Notificaciones deshabilitadas');
      return;
    }

    // Cancelar notificaciones existentes para este medicamento
    await this.cancelNotificationsForMedication(medicamento._id);

    const horarios = this.calculateMedicationTimes(medicamento.frecuencia);
    const fechaInicio = new Date(medicamento.duracion.inicio);
    const fechaFin = new Date(medicamento.duracion.fin);
    
    const notifications: MedicationNotification[] = [];

    // Calcular días de tratamiento
    const daysDifference = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

    for (let day = 0; day <= daysDifference; day++) {
      const currentDate = new Date(fechaInicio);
      currentDate.setDate(currentDate.getDate() + day);

      // Solo programar para fechas futuras
      if (currentDate <= new Date()) continue;

      for (const horario of horarios) {
        const [hour, minute] = horario.split(':').map(Number);
        const notificationDate = new Date(currentDate);
        notificationDate.setHours(hour, minute, 0, 0);

        // Solo programar si la fecha/hora es futura
        if (notificationDate <= new Date()) continue;

        const notification: MedicationNotification = {
          id: `med_${medicamento._id}_${day}_${horario}_${Date.now()}`,
          medicamentoId: medicamento._id,
          medicamentoNombre: medicamento.nombre,
          dosis: `${medicamento.dosis} ${medicamento.unidad}`,
          horario: horario,
          fechaHora: notificationDate,
          activo: true,
          repeticiones: 0,
          prioridad: this.getMedicationPriority(medicamento),
        };

        notifications.push(notification);

        // Programar notificación nativa
        await this.scheduleNativeNotification(notification, settings);
      }
    }

    // Guardar notificaciones
    await this.saveNotifications(medicamento._id, notifications);
    
    Alert.alert(
      '✅ Recordatorios Programados',
      `Se han configurado ${notifications.length} recordatorios para ${medicamento.nombre}`,
      [{ text: 'OK' }]
    );
  }

  // Programar notificación nativa
  private async scheduleNativeNotification(
    notification: MedicationNotification,
    settings: NotificationSettings
  ): Promise<void> {
    const notificationData = {
      id: notification.id,
      title: '💊 Recordatorio de Medicamento',
      message: `Es hora de tomar ${notification.medicamentoNombre} (${notification.dosis})`,
      date: notification.fechaHora,
      playSound: settings.sound,
      soundName: settings.sound ? 'default' : undefined,
      vibrate: settings.vibration,
      vibration: settings.vibration ? 300 : 0,
      priority: (notification.prioridad === 'high' ? 'high' : 'default') as 'high' | 'default',
      importance: (notification.prioridad === 'high' ? 'high' : 'default') as 'high' | 'default',
      autoCancel: false,
      ongoing: false,
      actions: ['Tomado', 'Posponer'],
      invokeApp: true,
      userInfo: {
        medicamentoId: notification.medicamentoId,
        notificationId: notification.id,
        type: 'medication_reminder',
      },
      ...(Platform.OS === 'android' && {
        channelId: 'medication-reminders',
        largeIcon: 'ic_medication',
        smallIcon: 'ic_notification',
        bigText: `Medicamento: ${notification.medicamentoNombre}\\nDosis: ${notification.dosis}\\nHorario: ${notification.horario}`,
        subText: 'Life Reminder',
        color: '#007AFF',
        group: 'medication_reminders',
        groupSummary: false,
      }),
    };

    PushNotification.localNotificationSchedule(notificationData);
  }

  // Manejar notificación recibida
  private async handleNotificationReceived(notification: any): Promise<void> {
    const { userInfo } = notification;
    
    if (userInfo?.type === 'medication_reminder') {
      // Registrar en historial
      await this.addToHistory({
        id: userInfo.notificationId,
        medicamentoId: userInfo.medicamentoId,
        fechaHora: new Date(),
        accion: 'mostrada',
        timestamp: new Date(),
      });

      // Manejar acciones
      if (notification.action === 'Tomado') {
        await this.markMedicationTaken(userInfo.medicamentoId, userInfo.notificationId);
      } else if (notification.action === 'Posponer') {
        await this.snoozeMedication(userInfo.medicamentoId, userInfo.notificationId);
      }
    }
  }

  // Marcar medicamento como tomado
  async markMedicationTaken(medicamentoId: string, notificationId: string): Promise<void> {
    await this.addToHistory({
      id: notificationId,
      medicamentoId: medicamentoId,
      fechaHora: new Date(),
      accion: 'tomada',
      timestamp: new Date(),
    });

    // Cancelar notificación
    PushNotification.cancelLocalNotifications({ id: notificationId });
    
    Alert.alert('✅ Medicamento Tomado', 'Registro guardado exitosamente', [{ text: 'OK' }]);
  }

  // Posponer medicamento
  async snoozeMedication(medicamentoId: string, notificationId: string): Promise<void> {
    const settings = await this.getNotificationSettings();
    const notifications = await this.getNotifications(medicamentoId);
    
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    if (notification.repeticiones >= settings.maxSnoozes) {
      Alert.alert(
        '⏰ Límite de Postergaciones',
        'Has alcanzado el límite máximo de postergaciones para este medicamento.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Incrementar repeticiones
    notification.repeticiones++;
    
    // Programar nueva notificación
    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() + settings.snoozeMinutes);
    notification.fechaHora = newDate;

    await this.scheduleNativeNotification(notification, settings);
    await this.saveNotifications(medicamentoId, notifications);
    
    await this.addToHistory({
      id: notificationId,
      medicamentoId: medicamentoId,
      fechaHora: new Date(),
      accion: 'pospuesta',
      timestamp: new Date(),
    });

    Alert.alert(
      '⏰ Medicamento Pospuesto',
      `Te recordaremos de nuevo en ${settings.snoozeMinutes} minutos.`,
      [{ text: 'OK' }]
    );
  }

  // Calcular horarios de medicamento
  private calculateMedicationTimes(frecuencia: string): string[] {
    const horarios: string[] = [];
    
    switch (frecuencia.toLowerCase()) {
      case 'cada 24 horas':
      case 'una vez al día':
        horarios.push('08:00');
        break;
      case 'cada 12 horas':
      case 'dos veces al día':
        horarios.push('08:00', '20:00');
        break;
      case 'cada 8 horas':
      case 'tres veces al día':
        horarios.push('08:00', '16:00', '24:00');
        break;
      case 'cada 6 horas':
      case 'cuatro veces al día':
        horarios.push('06:00', '12:00', '18:00', '24:00');
        break;
      case 'cada 4 horas':
        horarios.push('06:00', '10:00', '14:00', '18:00', '22:00');
        break;
      default:
        horarios.push('08:00');
    }
    
    return horarios;
  }

  // Determinar prioridad del medicamento
  private getMedicationPriority(medicamento: Medicamento): 'low' | 'normal' | 'high' {
    const importantKeywords = ['insulin', 'heart', 'blood pressure', 'emergency'];
    const medicationLower = medicamento.nombre.toLowerCase();
    
    if (importantKeywords.some(keyword => medicationLower.includes(keyword))) {
      return 'high';
    }
    
    return 'normal';
  }

  // Configuración de notificaciones
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(EnhancedNotificationService.SETTINGS_KEY);
      return settings ? JSON.parse(settings) : this.defaultSettings;
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      return this.defaultSettings;
    }
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        EnhancedNotificationService.SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  }

  // Gestión de notificaciones guardadas
  private async getNotifications(medicamentoId: string): Promise<MedicationNotification[]> {
    try {
      const notifications = await AsyncStorage.getItem(
        `${EnhancedNotificationService.NOTIFICATIONS_KEY}_${medicamentoId}`
      );
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  private async saveNotifications(
    medicamentoId: string,
    notifications: MedicationNotification[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${EnhancedNotificationService.NOTIFICATIONS_KEY}_${medicamentoId}`,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Error guardando notificaciones:', error);
    }
  }

  // Cancelar notificaciones
  async cancelNotificationsForMedication(medicamentoId: string): Promise<void> {
    const notifications = await this.getNotifications(medicamentoId);
    
    notifications.forEach(notification => {
      PushNotification.cancelLocalNotifications({ id: notification.id });
    });

    await AsyncStorage.removeItem(
      `${EnhancedNotificationService.NOTIFICATIONS_KEY}_${medicamentoId}`
    );
  }

  async cancelAllNotifications(): Promise<void> {
    PushNotification.cancelAllLocalNotifications();
    
    // Limpiar todas las notificaciones guardadas
    const keys = await AsyncStorage.getAllKeys();
    const notificationKeys = keys.filter(key => 
      key.startsWith(EnhancedNotificationService.NOTIFICATIONS_KEY)
    );
    
    await AsyncStorage.multiRemove(notificationKeys);
  }

  // Historial de notificaciones
  private async addToHistory(entry: NotificationHistory): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(EnhancedNotificationService.HISTORY_KEY);
      const history: NotificationHistory[] = historyJson ? JSON.parse(historyJson) : [];
      
      history.push(entry);
      
      // Mantener solo los últimos 100 registros
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      await AsyncStorage.setItem(
        EnhancedNotificationService.HISTORY_KEY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.error('Error guardando historial:', error);
    }
  }

  async getNotificationHistory(): Promise<NotificationHistory[]> {
    try {
      const historyJson = await AsyncStorage.getItem(EnhancedNotificationService.HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  // Solicitar permisos
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then((permissions: any) => {
        resolve(permissions.alert || permissions.badge || permissions.sound);
      });
    });
  }

  // Verificar permisos
  async checkPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions(resolve);
    });
  }
}

export default new EnhancedNotificationService();