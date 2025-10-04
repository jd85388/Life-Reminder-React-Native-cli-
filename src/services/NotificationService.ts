// src/services/NotificationService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Medicamento } from './MedicamentoService';

export interface RecordatorioConfig {
  medicamentoId: string;
  medicamentoNombre: string;
  horarios: string[];
  sonidoPersonalizado?: boolean;
  vibracion?: boolean;
  repetirMinutos?: number;
}

export interface NotificationData {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  dosis: string;
  horario: string;
  fechaHora: Date;
}

export interface RecordatorioLocal {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  dosis: string;
  horario: string;
  fechaHora: string;
  activo: boolean;
  fechaCompletado?: string;
}

class NotificationService {
  private static readonly STORAGE_KEY = 'recordatorios_medicamentos';

  // Programar recordatorios para un medicamento
  async programarRecordatoriosMedicamento(medicamento: Medicamento): Promise<void> {
    const horarios = this.calcularHorariosToma(medicamento.frecuencia);
    const fechaInicio = new Date(medicamento.duracion.inicio);
    const fechaFin = new Date(medicamento.duracion.fin);

    // Cancelar recordatorios existentes para este medicamento
    await this.cancelarRecordatoriosMedicamento(medicamento._id);

    const recordatorios: RecordatorioLocal[] = [];

    // Programar para cada día del tratamiento
    const diasTratamiento = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

    for (let dia = 0; dia <= diasTratamiento; dia++) {
      const fechaActual = new Date(fechaInicio);
      fechaActual.setDate(fechaActual.getDate() + dia);

      // Solo programar si la fecha es futura
      if (fechaActual <= new Date()) continue;

      for (const horario of horarios) {
        const [hora, minuto] = horario.split(':').map(Number);
        const fechaNotificacion = new Date(fechaActual);
        fechaNotificacion.setHours(hora, minuto, 0, 0);

        // Solo programar si la fecha/hora es futura
        if (fechaNotificacion <= new Date()) continue;

        const recordatorio: RecordatorioLocal = {
          id: `${medicamento._id}_${dia}_${horario}`,
          medicamentoId: medicamento._id,
          medicamentoNombre: medicamento.nombre,
          dosis: `${medicamento.dosis} ${medicamento.unidad}`,
          horario: horario,
          fechaHora: fechaNotificacion.toISOString(),
          activo: true,
        };

        recordatorios.push(recordatorio);
      }
    }

    // Guardar recordatorios en AsyncStorage
    await this.guardarRecordatorios(medicamento._id, recordatorios);
    
    // Mostrar confirmación
    Alert.alert(
      'Recordatorios programados',
      `Se programaron ${recordatorios.length} recordatorios para ${medicamento.nombre}`,
      [{ text: 'OK' }]
    );
  }

  // Calcular horarios de toma según frecuencia
  private calcularHorariosToma(frecuencia: string): string[] {
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
        horarios.push('08:00', '16:00', '00:00');
        break;
      case 'cada 6 horas':
      case 'cuatro veces al día':
        horarios.push('06:00', '12:00', '18:00', '00:00');
        break;
      case 'cada 4 horas':
        horarios.push('06:00', '10:00', '14:00', '18:00', '22:00', '02:00');
        break;
      default:
        horarios.push('08:00');
    }
    
    return horarios;
  }

  // Obtener recordatorios pendientes para hoy
  async obtenerRecordatoriosHoy(): Promise<RecordatorioLocal[]> {
    try {
      const hoy = new Date();
      const inicioHoy = new Date(hoy);
      inicioHoy.setHours(0, 0, 0, 0);
      const finHoy = new Date(hoy);
      finHoy.setHours(23, 59, 59, 999);

      const keys = await AsyncStorage.getAllKeys();
      const recordatoriosKeys = keys.filter(key => key.startsWith('recordatorios_'));
      
      const todosLosRecordatorios: RecordatorioLocal[] = [];

      for (const key of recordatoriosKeys) {
        const recordatoriosJson = await AsyncStorage.getItem(key);
        if (recordatoriosJson) {
          const recordatorios: RecordatorioLocal[] = JSON.parse(recordatoriosJson);
          todosLosRecordatorios.push(...recordatorios);
        }
      }

      return todosLosRecordatorios.filter(recordatorio => {
        const fechaRecordatorio = new Date(recordatorio.fechaHora);
        return recordatorio.activo && 
               fechaRecordatorio >= inicioHoy && 
               fechaRecordatorio <= finHoy;
      }).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

    } catch (error) {
      console.error('Error obteniendo recordatorios de hoy:', error);
      return [];
    }
  }

  // Obtener próximos recordatorios (próximas 24 horas)
  async obtenerProximosRecordatorios(): Promise<RecordatorioLocal[]> {
    try {
      const ahora = new Date();
      const proximas24h = new Date(ahora.getTime() + (24 * 60 * 60 * 1000));

      const keys = await AsyncStorage.getAllKeys();
      const recordatoriosKeys = keys.filter(key => key.startsWith('recordatorios_'));
      
      const todosLosRecordatorios: RecordatorioLocal[] = [];

      for (const key of recordatoriosKeys) {
        const recordatoriosJson = await AsyncStorage.getItem(key);
        if (recordatoriosJson) {
          const recordatorios: RecordatorioLocal[] = JSON.parse(recordatoriosJson);
          todosLosRecordatorios.push(...recordatorios);
        }
      }

      return todosLosRecordatorios.filter(recordatorio => {
        const fechaRecordatorio = new Date(recordatorio.fechaHora);
        return recordatorio.activo && 
               fechaRecordatorio >= ahora && 
               fechaRecordatorio <= proximas24h;
      }).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

    } catch (error) {
      console.error('Error obteniendo próximos recordatorios:', error);
      return [];
    }
  }

  // Marcar recordatorio como completado
  async marcarRecordatorioCompletado(recordatorioId: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const recordatoriosKeys = keys.filter(key => key.startsWith('recordatorios_'));

      for (const key of recordatoriosKeys) {
        const recordatoriosJson = await AsyncStorage.getItem(key);
        if (recordatoriosJson) {
          const recordatorios: RecordatorioLocal[] = JSON.parse(recordatoriosJson);
          const recordatorioIndex = recordatorios.findIndex(r => r.id === recordatorioId);
          
          if (recordatorioIndex !== -1) {
            recordatorios[recordatorioIndex].activo = false;
            await AsyncStorage.setItem(key, JSON.stringify(recordatorios));
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error marcando recordatorio como completado:', error);
    }
  }

  // Cancelar recordatorios de un medicamento específico
  async cancelarRecordatoriosMedicamento(medicamentoId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`recordatorios_${medicamentoId}`);
    } catch (error) {
      console.error('Error cancelando recordatorios:', error);
    }
  }

  // Cancelar todos los recordatorios
  async cancelarTodosLosRecordatorios(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const recordatoriosKeys = keys.filter(key => key.startsWith('recordatorios_'));
      await AsyncStorage.multiRemove(recordatoriosKeys);
    } catch (error) {
      console.error('Error cancelando todos los recordatorios:', error);
    }
  }

  // Enviar notificación de prueba (simulada)
  async enviarNotificacionPrueba(): Promise<void> {
    Alert.alert(
      '🧪 Notificación de prueba',
      'Sistema de recordatorios funcionando correctamente',
      [{ text: 'OK' }]
    );
  }

  // Guardar recordatorios en AsyncStorage
  private async guardarRecordatorios(medicamentoId: string, recordatorios: RecordatorioLocal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`recordatorios_${medicamentoId}`, JSON.stringify(recordatorios));
    } catch (error) {
      console.error('Error guardando recordatorios:', error);
    }
  }

  // Obtener estadísticas de recordatorios
  async obtenerEstadisticasRecordatorios(): Promise<{
    total: number;
    hoy: number;
    proximaHora: number;
  }> {
    try {
      const recordatoriosHoy = await this.obtenerRecordatoriosHoy();
      const proximosRecordatorios = await this.obtenerProximosRecordatorios();
      
      const ahora = new Date();
      const proximaHora = new Date(ahora.getTime() + (60 * 60 * 1000));
      
      const recordatoriosProximaHora = proximosRecordatorios.filter(recordatorio => {
        const fechaRecordatorio = new Date(recordatorio.fechaHora);
        return fechaRecordatorio <= proximaHora;
      });

      return {
        total: proximosRecordatorios.length,
        hoy: recordatoriosHoy.length,
        proximaHora: recordatoriosProximaHora.length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { total: 0, hoy: 0, proximaHora: 0 };
    }
  }

  // Verificar recordatorios vencidos (que debían haberse tomado)
  async verificarRecordatoriosVencidos(): Promise<RecordatorioLocal[]> {
    try {
      const ahora = new Date();
      const hace2Horas = new Date(ahora.getTime() - (2 * 60 * 60 * 1000));

      const keys = await AsyncStorage.getAllKeys();
      const recordatoriosKeys = keys.filter(key => key.startsWith('recordatorios_'));
      
      const recordatoriosVencidos: RecordatorioLocal[] = [];

      for (const key of recordatoriosKeys) {
        const recordatoriosJson = await AsyncStorage.getItem(key);
        if (recordatoriosJson) {
          const recordatorios: RecordatorioLocal[] = JSON.parse(recordatoriosJson);
          const vencidos = recordatorios.filter(recordatorio => {
            const fechaRecordatorio = new Date(recordatorio.fechaHora);
            return recordatorio.activo && 
                   fechaRecordatorio >= hace2Horas && 
                   fechaRecordatorio <= ahora;
          });
          recordatoriosVencidos.push(...vencidos);
        }
      }

      return recordatoriosVencidos.sort((a, b) => 
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      );

    } catch (error) {
      console.error('Error verificando recordatorios vencidos:', error);
      return [];
    }
  }

  // Obtener próximos recordatorios (siguientes 7 días)
  static async obtenerProximosRecordatorios(): Promise<RecordatorioLocal[]> {
    try {
      const recordatorios = await this.obtenerTodosLosRecordatorios();
      const ahora = new Date();
      const enUnaSemana = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return recordatorios.filter(recordatorio => {
        const fechaRecordatorio = new Date(recordatorio.fechaHora);
        return recordatorio.activo && 
               fechaRecordatorio > ahora && 
               fechaRecordatorio <= enUnaSemana;
      }).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
    } catch (error) {
      console.error('Error al obtener próximos recordatorios:', error);
      return [];
    }
  }

  // Marcar recordatorio como completado
  static async marcarRecordatorioCompletado(recordatorioId: string): Promise<void> {
    try {
      const recordatorios = await this.obtenerTodosLosRecordatorios();
      const recordatorioIndex = recordatorios.findIndex(r => r.id === recordatorioId);
      
      if (recordatorioIndex !== -1) {
        recordatorios[recordatorioIndex].activo = false;
        recordatorios[recordatorioIndex].fechaCompletado = new Date().toISOString();
        
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(recordatorios));
      }
    } catch (error) {
      console.error('Error al marcar recordatorio como completado:', error);
      throw new Error('Error al marcar recordatorio como completado');
    }
  }

  // Cancelar todos los recordatorios
  static async cancelarTodosLosRecordatorios(): Promise<void> {
    try {
      const recordatorios = await this.obtenerTodosLosRecordatorios();
      const recordatoriosInactivos = recordatorios.map(recordatorio => ({
        ...recordatorio,
        activo: false,
        fechaCompletado: new Date().toISOString()
      }));
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(recordatoriosInactivos));
    } catch (error) {
      console.error('Error al cancelar recordatorios:', error);
      throw new Error('Error al cancelar recordatorios');
    }
  }

  // Obtener todos los recordatorios
  private static async obtenerTodosLosRecordatorios(): Promise<RecordatorioLocal[]> {
    try {
      const recordatoriosString = await AsyncStorage.getItem(this.STORAGE_KEY);
      return recordatoriosString ? JSON.parse(recordatoriosString) : [];
    } catch (error) {
      console.error('Error al obtener recordatorios:', error);
      return [];
    }
  }

  // Enviar notificación de prueba
  static async enviarNotificacionPrueba(): Promise<void> {
    Alert.alert(
      'Notificación de prueba',
      'Esta es una notificación de recordatorio de medicamento',
      [{ text: 'OK' }]
    );
  }
}

export default new NotificationService();