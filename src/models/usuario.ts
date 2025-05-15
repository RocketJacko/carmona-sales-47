export interface Usuario {
  id: number;
  idcliente: number;
  nombres: string;
  apellidos: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: string;
  comprobante: string;
  email_agente?: string;
  created_at?: string;
  updated_at?: string;
}


