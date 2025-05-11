import { Agente, AgenteModel } from '../models/Agente';
import { Test } from '../__tests__/utils/Test';

export class AgenteController {
  private static test = Test.getInstance();

  static async obtenerAgentes(): Promise<Agente[]> {
    try {
      return await AgenteModel.obtenerTodos();
    } catch (error) {
      throw new Error(`Error al obtener agentes: ${error}`);
    }
  }

  static async obtenerAgentePorId(id: number): Promise<Agente | null> {
    try {
      return await AgenteModel.obtenerPorId(id);
    } catch (error) {
      throw new Error(`Error al obtener agente: ${error}`);
    }
  }

  static async crearAgente(agente: Omit<Agente, 'id'>): Promise<Agente> {
    try {
      // Validar email antes de crear
      const esEmailValido = await this.test.validarEmail(agente.email);
      if (!esEmailValido) {
        throw new Error('El email proporcionado no es válido');
      }

      return await AgenteModel.crear(agente);
    } catch (error) {
      throw new Error(`Error al crear agente: ${error}`);
    }
  }

  static async actualizarAgente(id: number, agente: Partial<Agente>): Promise<Agente | null> {
    try {
      // Si se está actualizando el email, validarlo
      if (agente.email) {
        const esEmailValido = await this.test.validarEmail(agente.email);
        if (!esEmailValido) {
          throw new Error('El email proporcionado no es válido');
        }
      }

      return await AgenteModel.actualizar(id, agente);
    } catch (error) {
      throw new Error(`Error al actualizar agente: ${error}`);
    }
  }

  static async eliminarAgente(id: number): Promise<boolean> {
    try {
      return await AgenteModel.eliminar(id);
    } catch (error) {
      throw new Error(`Error al eliminar agente: ${error}`);
    }
  }

  static async validarEstructuraTabla(): Promise<boolean> {
    try {
      return await AgenteModel.validarEstructura();
    } catch (error) {
      throw new Error(`Error al validar estructura de la tabla: ${error}`);
    }
  }
} 