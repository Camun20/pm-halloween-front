import type { User, Category, VoteRecord } from '../types';

const API_URL = (import.meta.env.PUBLIC_API_URL || 'https://u1kjxw5112.execute-api.us-east-1.amazonaws.com').replace(/\/$/, '');

const TOKEN_KEY = 'atiempo_halloween_jwt_token';

export class ApiService {
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  static setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  static clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  }

  private static getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // 1. Iniciar Sesión con Cognito / DynamoDB
  static async login(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Credenciales inválidas.' };
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (err: any) {
      console.warn('Fallo de red en login con API Gateway, verificando modo contingencia:', err);
      return { success: false, error: 'No se pudo conectar con el servidor AWS: ' + err.message };
    }
  }

  // 2. Obtener lista de usuarios
  static async getUsers(): Promise<User[] | null> {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.warn('Error al obtener usuarios desde API:', err);
      return null;
    }
  }

  // 3. Crear usuario (Admin)
  static async createUser(userData: {
    username: string;
    password?: string;
    name: string;
    role: string;
    groupName: string;
    gender?: 'M' | 'F';
    avatar?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al crear usuario en AWS' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 4. Cambiar contraseña de usuario (Admin)
  static async updateUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/password`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al actualizar contraseña' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 5. Obtener Categorías
  static async getCategories(): Promise<Category[] | null> {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.categories || [];
    } catch (err) {
      console.warn('Error al obtener categorías desde API:', err);
      return null;
    }
  }

  // 6. Crear Categoría (Admin)
  static async createCategory(categoryData: Omit<Category, 'id'>): Promise<{ success: boolean; category?: Category; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al guardar categoría en AWS' };
      }
      return { success: true, category: data.category };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 7. Enviar Voto
  static async submitVote(userId: string, selections: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ userId, selections }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al registrar voto en AWS' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 7.1 Obtener todos los votos registrados en AWS (para sincronización multi-navegador)
  static async getVotes(): Promise<VoteRecord[] | null> {
    try {
      const res = await fetch(`${API_URL}/votes`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.votes || [];
    } catch (err) {
      console.warn('Error al obtener votos desde API:', err);
      return null;
    }
  }

  // 8. Reiniciar Votos (Admin)
  static async resetVotes(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/votes/reset`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al limpiar votos en AWS' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 9. Obtener Puntuaciones calculadas
  static async getScores(): Promise<{ summary?: any; groupRanking?: any[]; categoryResults?: any[] } | null> {
    try {
      const res = await fetch(`${API_URL}/scores`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Error al obtener puntuaciones desde API:', err);
      return null;
    }
  }
}
