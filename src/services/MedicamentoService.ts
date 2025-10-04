// src/services/MedicamentoService.ts
import ApiService from './ApiService';

export interface Medicamento {
  _id: string;
  id_Paciente: string;
  nombre: string;
  dosis: number;
  unidad: string;
  frecuencia: string;
  viaAdministracion: string;
  duracion: {
    inicio: string;
    fin: string;
  };
  recetadoPor: string;
  descripcion: string;
  notas?: string;
  estado: boolean;
  causaUso: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrearMedicamentoData {
  nombre: string;
  dosis: number;
  unidad: string;
  frecuencia: string;
  viaAdministracion: string;
  duracion: {
    inicio: Date;
    fin: Date;
  };
  recetadoPor: string;
  descripcion: string;
  notas?: string;
  causaUso: string;
}

export interface RecordatorioMedicamento {
  id: string;
  medicamentoId: string;
  horasTomas: string[];
  proximaToma: string;
  tomasRealizadas: number;
  tomasTotales: number;
}

class MedicamentoService {
  // Obtener todos los medicamentos del paciente
  async obtenerMedicamentos(): Promise<Medicamento[]> {
    try {
      const response = await ApiService.get('/Views/paciente/medicamentos');
      return response.medicamentos || response;
    } catch (error) {
      console.error('Error obteniendo medicamentos:', error);
      throw error;
    }
  }

  // Obtener medicamento por ID
  async obtenerMedicamentoPorId(id: string): Promise<Medicamento> {
    try {
      const response = await ApiService.get(`/Views/paciente/medicamento/${id}`);
      return response.medicamento || response;
    } catch (error) {
      console.error('Error obteniendo medicamento:', error);
      throw error;
    }
  }

  // Crear nuevo medicamento
  async crearMedicamento(data: CrearMedicamentoData): Promise<Medicamento> {
    try {
      const response = await ApiService.post('/Views/paciente/medicamento', data);
      return response;
    } catch (error) {
      console.error('Error creando medicamento:', error);
      throw error;
    }
  }

  // Actualizar medicamento
  async actualizarMedicamento(id: string, data: Partial<CrearMedicamentoData>): Promise<Medicamento> {
    try {
      const response = await ApiService.put(`/Views/paciente/medicamento/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error actualizando medicamento:', error);
      throw error;
    }
  }

  // Desactivar medicamento
  async desactivarMedicamento(id: string): Promise<void> {
    try {
      await ApiService.put(`/Views/paciente/medicamento/${id}`, { estado: false });
    } catch (error) {
      console.error('Error desactivando medicamento:', error);
      throw error;
    }
  }

  // Obtener medicamentos activos
  async obtenerMedicamentosActivos(): Promise<Medicamento[]> {
    try {
      const medicamentos = await this.obtenerMedicamentos();
      const hoy = new Date();
      
      return medicamentos.filter(medicamento => {
        const fechaFin = new Date(medicamento.duracion.fin);
        return medicamento.estado && fechaFin >= hoy;
      });
    } catch (error) {
      console.error('Error obteniendo medicamentos activos:', error);
      throw error;
    }
  }

  // Obtener medicamentos que requieren toma hoy
  async obtenerMedicamentosParaHoy(): Promise<Medicamento[]> {
    try {
      const medicamentosActivos = await this.obtenerMedicamentosActivos();
      // Aquí podrías filtrar por frecuencia y horarios
      return medicamentosActivos;
    } catch (error) {
      console.error('Error obteniendo medicamentos para hoy:', error);
      throw error;
    }
  }

  // Registrar toma de medicamento
  async registrarToma(medicamentoId: string, fechaHora: Date): Promise<void> {
    try {
      await ApiService.post(`/Views/paciente/medicamento/${medicamentoId}/toma`, {
        fechaHora: fechaHora.toISOString(),
      });
    } catch (error) {
      console.error('Error registrando toma:', error);
      throw error;
    }
  }

  // Calcular horarios de toma según frecuencia
  calcularHorariosToma(frecuencia: string): string[] {
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
        horarios.push('06:00', '10:00', '14:00', '18:00', '22:00', '02:00');
        break;
      default:
        horarios.push('08:00');
    }
    
    return horarios;
  }

  // Obtener próxima toma de un medicamento
  obtenerProximaToma(medicamento: Medicamento): Date | null {
    const horarios = this.calcularHorariosToma(medicamento.frecuencia);
    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    for (const horario of horarios) {
      const [hora, minuto] = horario.split(':').map(Number);
      const minutosToma = hora * 60 + minuto;

      if (minutosToma > horaActual) {
        const proximaToma = new Date(ahora);
        proximaToma.setHours(hora, minuto, 0, 0);
        return proximaToma;
      }
    }

    // Si no hay más tomas hoy, la próxima es mañana
    const [hora, minuto] = horarios[0].split(':').map(Number);
    const proximaToma = new Date(ahora);
    proximaToma.setDate(proximaToma.getDate() + 1);
    proximaToma.setHours(hora, minuto, 0, 0);
    return proximaToma;
  }

  // Obtener estadísticas de medicamentos
  async obtenerEstadisticasMedicamentos(): Promise<{
    total: number;
    activos: number;
    finalizados: number;
    tomasHoy: number;
  }> {
    try {
      const medicamentos = await this.obtenerMedicamentos();
      const hoy = new Date();
      
      const total = medicamentos.length;
      const activos = medicamentos.filter(med => {
        const fechaFin = new Date(med.duracion.fin);
        return med.estado && fechaFin >= hoy;
      }).length;
      
      const finalizados = total - activos;
      const tomasHoy = await this.contarTomasHoy();

      return { total, activos, finalizados, tomasHoy };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // Contar tomas programadas para hoy
  private async contarTomasHoy(): Promise<number> {
    try {
      const medicamentosActivos = await this.obtenerMedicamentosActivos();
      let totalTomas = 0;

      medicamentosActivos.forEach(medicamento => {
        const horarios = this.calcularHorariosToma(medicamento.frecuencia);
        totalTomas += horarios.length;
      });

      return totalTomas;
    } catch (error) {
      return 0;
    }
  }
}

export default new MedicamentoService();