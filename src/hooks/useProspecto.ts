import { useState } from 'react';
import { ProspectoService } from '@/services/prospectoService';
import { useToast } from '@/hooks/use-toast';

export const useProspecto = () => {
    const [prospecto, setProspecto] = useState<any>(null);
    const [cargando, setCargando] = useState(false);
    const { toast } = useToast();

    const buscarProspecto = async () => {
        try {
            setCargando(true);
            const servicio = ProspectoService.getInstance();
            const resultado = await servicio.buscarProspectoDisponible();
            
            if (resultado) {
                setProspecto(resultado);
                toast({
                    title: 'Prospecto encontrado',
                    description: 'Se ha asignado un nuevo prospecto',
                });
            } else {
                toast({
                    title: 'Sin prospectos disponibles',
                    description: 'No hay prospectos disponibles en este momento',
                    variant: 'destructive'
                });
            }
        } catch (error: any) {
            console.error('Error al buscar prospecto:', error);
            toast({
                title: 'Error',
                description: error.message || 'Error al buscar prospecto',
                variant: 'destructive'
            });
        } finally {
            setCargando(false);
        }
    };

    return {
        prospecto,
        cargando,
        buscarProspecto
    };
}; 