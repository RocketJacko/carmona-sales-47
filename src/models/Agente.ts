import { pool } from '../services/db.service';

export interface Agente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
}

export class AgenteModel {
  static async obtenerTodos(): Promise<Agente[]> {
    const result = await pool.query('SELECT * FROM agentes');
    return result.rows;
  }

  static async obtenerPorId(id: number): Promise<Agente | null> {
    const result = await pool.query('SELECT * FROM agentes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async crear(agente: Omit<Agente, 'id'>): Promise<Agente> {
    const { nombre, email, telefono, estado } = agente;
    const result = await pool.query(
      'INSERT INTO agentes (nombre, email, telefono, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, telefono, estado]
    );
    return result.rows[0];
  }

  static async actualizar(id: number, agente: Partial<Agente>): Promise<Agente | null> {
    const campos = Object.keys(agente);
    const valores = Object.values(agente);
    
    const setClause = campos.map((campo, index) => `${campo} = $${index + 2}`).join(', ');
    const query = `UPDATE agentes SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await pool.query(query, [id, ...valores]);
    return result.rows[0] || null;
  }

  static async eliminar(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM agentes WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  static async validarEstructura(): Promise<boolean> {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'agentes'
    `);
    
    const columnasEsperadas = ['id', 'nombre', 'email', 'telefono', 'estado'];
    const columnasEncontradas = result.rows.map(row => row.column_name);
    
    return columnasEsperadas.every(columna => columnasEncontradas.includes(columna));
  }
} 