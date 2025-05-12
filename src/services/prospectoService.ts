import { supabase } from '@/config/supabase';

export class ProspectoService {
    private static instance: ProspectoService;

    private constructor() {}

    public static getInstance(): ProspectoService {
        if (!ProspectoService.instance) {
            ProspectoService.instance = new ProspectoService();
        }
        return ProspectoService.instance;
    }

    /**
     * Busca un prospecto disponible usando el procedimiento almacenado
     * @returns Promise con los datos del prospecto o null si no hay disponibles
     */
    public async buscarProspectoDisponible(): Promise<any> {
        try {
            const { data, error } = await supabase
                .rpc('buscarCliente');

            if (error) {
                console.error('Error al buscar prospecto:', error);
                throw new Error('Error al buscar prospecto disponible');
            }

            return data;
        } catch (error) {
            console.error('Error en el servicio:', error);
            throw error;
        }
    }
} 