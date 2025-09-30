// src/services/ConsultaService.ts
import ApiService from './ApiService';

export interface Consulta {
  _id: string;
  id_Paciente: string;
  especialidad: string;
  doctor: string;
  fecha: string;
  motivo: string;
  estado: boolean;
  direccion: string;
  observacion?: string;
  recordatorio: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  createdAt: string;
  updatedAt: string;
}

export interface CrearConsultaData {
  especialidad: string;
  doctor: string;
  fecha: Date;
  motivo: string;
  direccion: string;
  observacion?: string;
  recordatorio: boolean;
  prioridad: 'baja' | 'media' | 'alta';
}

class ConsultaService {
  // Obtener todas las consultas del paciente
  async obtenerConsultas(): Promise<Consulta[]> {
    try {
      const response = await ApiService.get('/Views/paciente/consultas');
      return response.consultas || response;
    } catch (error) {
      console.error('Error obteniendo consultas:', error);
      throw error;
    }
  }

  // Obtener consulta por ID
  async obtenerConsultaPorId(id: string): Promise<Consulta> {
    try {
      const response = await ApiService.get(`/Views/paciente/consulta/${id}`);
      return response.consulta || response;
    } catch (error) {
      console.error('Error obteniendo consulta:', error);
      throw error;
    }
  }

  // Crear nueva consulta
  async crearConsulta(data: CrearConsultaData): Promise<Consulta> {
    try {
      const response = await ApiService.post('/Views/paciente/consulta', data);
      return response;
    } catch (error) {
      console.error('Error creando consulta:', error);
      throw error;
    }
  }

  // Actualizar consulta
  async actualizarConsulta(id: string, data: Partial<CrearConsultaData>): Promise<Consulta> {
    try {
      const response = await ApiService.put(`/Views/paciente/consulta/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error actualizando consulta:', error);
      throw error;
    }
  }

  // Cancelar consulta (cambiar estado)
  async cancelarConsulta(id: string): Promise<void> {
    try {
      await ApiService.put(`/Views/paciente/consulta/${id}`, { estado: false });
    } catch (error) {
      console.error('Error cancelando consulta:', error);
      throw error;
    }
  }

  // Obtener consultas próximas (próximos 7 días)
  async obtenerConsultasProximas(): Promise<Consulta[]> {
    try {
      const consultas = await this.obtenerConsultas();
      const hoy = new Date();
      const proximos7Dias = new Date(hoy.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      return consultas.filter(consulta => {
        const fechaConsulta = new Date(consulta.fecha);
        return fechaConsulta >= hoy && fechaConsulta <= proximos7Dias && consulta.estado;
      });
    } catch (error) {
      console.error('Error obteniendo consultas próximas:', error);
      throw error;
    }
  }

  // Obtener historial de consultas
  async obtenerHistorialConsultas(): Promise<Consulta[]> {
    try {
      const consultas = await this.obtenerConsultas();
      const hoy = new Date();
      
      return consultas.filter(consulta => {
        const fechaConsulta = new Date(consulta.fecha);
        return fechaConsulta < hoy;
      }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw error;
    }
  }

  // Obtener consultas por prioridad
  async obtenerConsultasPorPrioridad(prioridad: 'baja' | 'media' | 'alta'): Promise<Consulta[]> {
    try {
      const consultas = await this.obtenerConsultas();
      return consultas.filter(consulta => consulta.prioridad === prioridad && consulta.estado);
    } catch (error) {
      console.error('Error obteniendo consultas por prioridad:', error);
      throw error;
    }
  }
}

export default new ConsultaService();