// src/services/RegistroService.ts
import ApiService from './ApiService';

export interface RegistroMedico {
  _id: string;
  pacienteId: string;
  tipo: 'consulta' | 'medicamento' | 'tratamiento' | 'examen' | 'emergencia';
  titulo: string;
  descripcion: string;
  fecha: string;
  medico?: {
    nombre: string;
    especialidad: string;
    telefono?: string;
  };
  medicamentos?: string[];
  adjuntos?: {
    nombre: string;
    url: string;
    tipo: 'imagen' | 'documento';
  }[];
  sintomas?: string[];
  diagnostico?: string;
  notas?: string;
  estado: 'activo' | 'completado' | 'cancelado';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FiltrosRegistro {
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  medico?: string;
  estado?: string;
  prioridad?: string;
}

export interface ResumenSalud {
  totalRegistros: number;
  consultasUltimoMes: number;
  medicamentosActivos: number;
  proximasCitas: number;
  alertasSalud: {
    tipo: 'medicamento' | 'consulta' | 'examen';
    mensaje: string;
    prioridad: 'alta' | 'media' | 'baja';
    fecha: string;
  }[];
}

class RegistroService {
  private readonly baseUrl = 'http://10.0.2.2:3000/api';

  // Obtener historial médico completo
  async obtenerHistorialMedico(filtros?: FiltrosRegistro): Promise<RegistroMedico[]> {
    try {
      const params = new URLSearchParams();
      if (filtros?.tipo) params.append('tipo', filtros.tipo);
      if (filtros?.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros?.fechaFin) params.append('fechaFin', filtros.fechaFin);
      if (filtros?.medico) params.append('medico', filtros.medico);
      if (filtros?.estado) params.append('estado', filtros.estado);
      if (filtros?.prioridad) params.append('prioridad', filtros.prioridad);

      const url = `${this.baseUrl}/registros${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await ApiService.get(url);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener historial médico');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo historial médico:', error);
      throw error;
    }
  }

  // Obtener registro específico
  async obtenerRegistro(registroId: string): Promise<RegistroMedico> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/${registroId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener registro');
      }

      return response.data;
    } catch (error) {
      console.error('Error obteniendo registro:', error);
      throw error;
    }
  }

  // Crear nuevo registro médico
  async crearRegistro(registro: Omit<RegistroMedico, '_id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<RegistroMedico> {
    try {
      const response = await ApiService.post(`${this.baseUrl}/registros`, registro);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al crear registro');
      }

      return response.data;
    } catch (error) {
      console.error('Error creando registro:', error);
      throw error;
    }
  }

  // Actualizar registro médico
  async actualizarRegistro(registroId: string, datos: Partial<RegistroMedico>): Promise<RegistroMedico> {
    try {
      const response = await ApiService.put(`${this.baseUrl}/registros/${registroId}`, datos);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar registro');
      }

      return response.data;
    } catch (error) {
      console.error('Error actualizando registro:', error);
      throw error;
    }
  }

  // Eliminar registro médico
  async eliminarRegistro(registroId: string): Promise<boolean> {
    try {
      const response = await ApiService.delete(`${this.baseUrl}/registros/${registroId}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar registro');
      }

      return true;
    } catch (error) {
      console.error('Error eliminando registro:', error);
      throw error;
    }
  }

  // Obtener resumen de salud
  async obtenerResumenSalud(): Promise<ResumenSalud> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/resumen`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener resumen de salud');
      }

      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen de salud:', error);
      // Retornar datos por defecto en caso de error
      return {
        totalRegistros: 0,
        consultasUltimoMes: 0,
        medicamentosActivos: 0,
        proximasCitas: 0,
        alertasSalud: [],
      };
    }
  }

  // Buscar registros por término
  async buscarRegistros(termino: string): Promise<RegistroMedico[]> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/buscar?q=${encodeURIComponent(termino)}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error en la búsqueda');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error buscando registros:', error);
      throw error;
    }
  }

  // Obtener registros por tipo
  async obtenerRegistrosPorTipo(tipo: RegistroMedico['tipo']): Promise<RegistroMedico[]> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/tipo/${tipo}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener registros por tipo');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo registros por tipo:', error);
      throw error;
    }
  }

  // Obtener estadísticas de salud
  async obtenerEstadisticas(periodo: 'semana' | 'mes' | 'trimestre' | 'año'): Promise<any> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/estadisticas?periodo=${periodo}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al obtener estadísticas');
      }

      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        consultasPorMes: [],
        medicamentosMasUsados: [],
        tiposRegistroDistribucion: [],
        tendenciaSalud: 'estable',
      };
    }
  }

  // Exportar historial médico
  async exportarHistorial(formato: 'pdf' | 'excel'): Promise<string> {
    try {
      const response = await ApiService.get(`${this.baseUrl}/registros/exportar?formato=${formato}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Error al exportar historial');
      }

      return response.data.url;
    } catch (error) {
      console.error('Error exportando historial:', error);
      throw error;
    }
  }

  // Subir archivo adjunto
  async subirAdjunto(archivo: FormData): Promise<{ url: string; nombre: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/registros/adjuntos`, {
        method: 'POST',
        body: archivo,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al subir archivo');
      }

      return data.data;
    } catch (error) {
      console.error('Error subiendo adjunto:', error);
      throw error;
    }
  }

  // Validar datos del registro
  validarRegistro(registro: Partial<RegistroMedico>): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!registro.titulo?.trim()) {
      errores.push('El título es obligatorio');
    }

    if (!registro.descripcion?.trim()) {
      errores.push('La descripción es obligatoria');
    }

    if (!registro.tipo) {
      errores.push('El tipo de registro es obligatorio');
    }

    if (!registro.fecha) {
      errores.push('La fecha es obligatoria');
    }

    if (!registro.prioridad) {
      errores.push('La prioridad es obligatoria');
    }

    if (!registro.estado) {
      errores.push('El estado es obligatorio');
    }

    if (registro.medico && !registro.medico.nombre?.trim()) {
      errores.push('El nombre del médico es obligatorio');
    }

    return {
      valido: errores.length === 0,
      errores,
    };
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Formatear fecha y hora
  formatearFechaHora(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Obtener color por tipo de registro
  obtenerColorTipo(tipo: RegistroMedico['tipo']): string {
    const colores = {
      consulta: '#3B82F6',
      medicamento: '#10B981',
      tratamiento: '#F59E0B',
      examen: '#8B5CF6',
      emergencia: '#EF4444',
    };
    return colores[tipo] || '#6B7280';
  }

  // Obtener icono por tipo de registro
  obtenerIconoTipo(tipo: RegistroMedico['tipo']): string {
    const iconos = {
      consulta: 'calendar-outline',
      medicamento: 'medical-outline',
      tratamiento: 'fitness-outline',
      examen: 'document-text-outline',
      emergencia: 'warning-outline',
    };
    return iconos[tipo] || 'clipboard-outline';
  }
}

export default new RegistroService();