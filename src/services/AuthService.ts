// src/services/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.80.11:3000';

export interface PacienteData {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  documento: number;
  numero: number;
  estado: boolean;
  verificado: boolean;
}

export interface LoginResponse {
  usuario: PacienteData;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fechaNacimiento: Date;
  documento: number;
  numero: number;
}

class AuthService {
  // Registro de paciente
  async register(data: RegisterData): Promise<PacienteData> {
    try {
      const response = await fetch(`${BASE_URL}/Views/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar paciente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Login de paciente
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${BASE_URL}/Views/ingreso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data: LoginResponse = await response.json();
      
      // Guardar tokens en AsyncStorage
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(data.usuario));

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Obtener token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      return null;
    }
  }

  // Obtener datos del usuario
  async getUserData(): Promise<PacienteData | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Recuperar contraseña
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/auth/recuperar-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar correo de recuperación');
      }
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      throw error;
    }
  }

  // Reenviar verificación
  async resendVerification(email: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/autenticacion/reenviar-verificacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al reenviar verificación');
      }
    } catch (error) {
      console.error('Error en reenvío de verificación:', error);
      throw error;
    }
  }
}

export default new AuthService();