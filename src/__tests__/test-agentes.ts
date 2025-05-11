import { Test } from './utils/Test';
import { AgenteController } from '../controllers/AgenteController';
import { pool } from '../services/db.service';

describe('Pruebas de Conexión a la Tabla Agentes', () => {
  let test: Test;

  beforeAll(() => {
    test = Test.getInstance();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('debería conectarse a la base de datos', async () => {
    try {
      const client = await pool.connect();
      expect(client).toBeDefined();
      client.release();
    } catch (error) {
      fail('Error al conectar a la base de datos: ' + error);
    }
  });

  it('debería obtener la lista de agentes', async () => {
    try {
      const agentes = await AgenteController.obtenerAgentes();
      expect(Array.isArray(agentes)).toBe(true);
      expect(agentes.length).toBeGreaterThan(0);
    } catch (error) {
      fail('Error al obtener agentes: ' + error);
    }
  });

  it('debería obtener un agente específico por ID', async () => {
    try {
      const agente = await AgenteController.obtenerAgentePorId(1);
      expect(agente).toBeDefined();
      expect(agente).toHaveProperty('id');
      expect(agente).toHaveProperty('nombre');
    } catch (error) {
      fail('Error al obtener agente específico: ' + error);
    }
  });

  it('debería validar la estructura de la tabla agentes', async () => {
    try {
      const esValida = await AgenteController.validarEstructuraTabla();
      expect(esValida).toBe(true);
    } catch (error) {
      fail('Error al validar estructura de la tabla: ' + error);
    }
  });

  it('debería validar el email de un agente', async () => {
    try {
      const agente = await AgenteController.obtenerAgentePorId(1);
      if (agente?.email) {
        const esEmailValido = await test.validarEmail(agente.email);
        expect(esEmailValido).toBe(true);
      }
    } catch (error) {
      fail('Error al validar email del agente: ' + error);
    }
  });

  it('debería crear un nuevo agente', async () => {
    try {
      const nuevoAgente = {
        nombre: 'Agente de Prueba',
        email: 'agente@prueba.com',
        telefono: '1234567890',
        estado: 'activo'
      };

      const agenteCreado = await AgenteController.crearAgente(nuevoAgente);
      expect(agenteCreado).toBeDefined();
      expect(agenteCreado.nombre).toBe(nuevoAgente.nombre);
      expect(agenteCreado.email).toBe(nuevoAgente.email);
    } catch (error) {
      fail('Error al crear agente: ' + error);
    }
  });

  it('debería actualizar un agente existente', async () => {
    try {
      const actualizacion = {
        nombre: 'Agente Actualizado',
        estado: 'inactivo'
      };

      const agenteActualizado = await AgenteController.actualizarAgente(1, actualizacion);
      expect(agenteActualizado).toBeDefined();
      expect(agenteActualizado?.nombre).toBe(actualizacion.nombre);
      expect(agenteActualizado?.estado).toBe(actualizacion.estado);
    } catch (error) {
      fail('Error al actualizar agente: ' + error);
    }
  });
}); 