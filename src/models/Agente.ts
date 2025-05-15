import { supabase } from '@/config/supabase';

export interface Agente {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

export class AgenteModel {
  static async getAgentes(): Promise<Agente[]> {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .eq('activo', true);

      if (error) {
        console.error('Error al obtener agentes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al obtener agentes:', error);
      return [];
    }
  }

  static async obtenerTodos(): Promise<Agente[]> {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*');

      if (error) {
        console.error('Error al obtener agentes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al obtener agentes:', error);
      return [];
    }
  }

  static async obtenerPorId(id: number): Promise<Agente | null> {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al obtener agente:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error al obtener agente:', error);
      return null;
    }
  }

  static async crear(agente: Omit<Agente, 'id'>): Promise<Agente | null> {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .insert([agente])
        .select()
        .single();

      if (error) {
        console.error('Error al crear agente:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error al crear agente:', error);
      return null;
    }
  }

  static async actualizar(id: number, agente: Partial<Agente>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agentes')
        .update(agente)
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar agente:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al actualizar agente:', error);
      return false;
    }
  }

  static async eliminar(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agentes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar agente:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar agente:', error);
      return false;
    }
  }

  static async buscar(termino: string): Promise<Agente[]> {
    try {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .or(`nombre.ilike.%${termino}%,email.ilike.%${termino}%`);

      if (error) {
        console.error('Error al buscar agentes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error al buscar agentes:', error);
      return [];
    }
  }
} 