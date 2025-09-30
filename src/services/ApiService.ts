// src/services/ApiService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:3000';

class ApiService {
  // Método para hacer peticiones autenticadas
  async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = await AsyncStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si el token expiró, intentar refreshear
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Reintentar la petición con el nuevo token
        const newToken = await AsyncStorage.getItem('accessToken');
        return fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return response;
  }

  // Refrescar token
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('accessToken', data.accessToken);
        return true;
      }

      // Si el refresh falla, limpiar tokens
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // GET request
  async get(endpoint: string): Promise<any> {
    const response = await this.authenticatedRequest(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  }

  // POST request
  async post(endpoint: string, data: any): Promise<any> {
    const response = await this.authenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  }

  // PUT request
  async put(endpoint: string, data: any): Promise<any> {
    const response = await this.authenticatedRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  }

  // DELETE request
  async delete(endpoint: string): Promise<any> {
    const response = await this.authenticatedRequest(endpoint, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la petición');
    }

    return await response.json();
  }
}

export default new ApiService();