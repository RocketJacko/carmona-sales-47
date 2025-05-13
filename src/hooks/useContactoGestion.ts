import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContactoInfo, HistorialContacto } from '@/components/usuarios/ContactoGestion';

export const useContactoGestion = () => {
  const [usuarioEnGestion, setUsuarioEnGestion] = useState<number | null>(null);
  const [contactosInfo, setContactosInfo] = useState<Record<number, ContactoInfo[]>>({});
  const [indiceContactoActual, setIndiceContactoActual] = useState<Record<number, number>>({});
  const [historialContactos, setHistorialContactos] = useState<Record<number, HistorialContacto[]>>({});
  const { toast } = useToast();

  const inicializarContactos = useCallback((usuariosIds: number[]) => {
    const contactosIniciales: Record<number, ContactoInfo[]> = {};
    const indicesIniciales: Record<number, number> = {};
    const historialesIniciales: Record<number, HistorialContacto[]> = {};
    
    usuariosIds.forEach(id => {
      contactosIniciales[id] = [
        {
          id: 1,
          pagaduria: 'Empresa ABC',
          tipo: 'movil',
          numero: '300' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        },
        {
          id: 2,
          pagaduria: 'Empresa XYZ',
          tipo: 'movil',
          numero: '310' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        },
        {
          id: 3,
          pagaduria: 'Empresa DEF',
          tipo: 'movil',
          numero: '320' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        },
        {
          id: 4,
          pagaduria: 'Empresa GHI',
          tipo: 'fijo',
          numero: '601' + Math.floor(1000000 + Math.random() * 9000000),
          ciudad: 'Bogotá',
          tipificacion: 'no contesta',
        },
        {
          id: 5,
          pagaduria: 'Empresa JKL',
          tipo: 'fijo',
          numero: '602' + Math.floor(1000000 + Math.random() * 9000000),
          ciudad: 'Medellín',
          tipificacion: 'no contesta',
        }
      ];
      indicesIniciales[id] = 0;
      historialesIniciales[id] = [];
    });
    
    setContactosInfo(contactosIniciales);
    setIndiceContactoActual(indicesIniciales);
    setHistorialContactos(historialesIniciales);
  }, []);

  const handleIniciarGestion = (usuarioId: number) => {
    if (usuarioEnGestion === usuarioId) {
      setUsuarioEnGestion(null);
    } else {
      setUsuarioEnGestion(usuarioId);
      toast({
        title: 'Gestión Iniciada',
        description: `Se ha iniciado la gestión para el cliente seleccionado`,
        duration: 3000,
      });
    }
  };

  const handleTipificacionChange = (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => {
    // 1. Actualizar la tipificación
    setContactosInfo(prevContactos => {
      if (!prevContactos[usuarioId]) return prevContactos;
      const indiceActual = indiceContactoActual[usuarioId];
      const nuevosContactos = { ...prevContactos };
      nuevosContactos[usuarioId] = prevContactos[usuarioId].map((contacto, idx) =>
        idx === indiceActual
          ? { ...contacto, tipificacion: nuevaTipificacion }
          : contacto
      );
      return nuevosContactos;
    });

    // 2. Actualizar historial
    setHistorialContactos(prevHistorial => {
      const contactoActual = contactosInfo[usuarioId]?.[indiceContactoActual[usuarioId]];
      if (!contactoActual) return prevHistorial;
      return {
        ...prevHistorial,
        [usuarioId]: [
          ...(prevHistorial[usuarioId] || []),
          {
            id: Date.now(),
            numero: contactoActual.numero,
            tipo: contactoActual.tipo,
            tipificacion: nuevaTipificacion,
            fecha: new Date()
          }
        ]
      };
    });

    // 3. Solo avanzar al siguiente número si la tipificación NO es 'contactado'
    if (nuevaTipificacion !== 'contactado') {
      setIndiceContactoActual(prevIndices => {
        const indiceActual = prevIndices[usuarioId] || 0;
        const totalContactos = contactosInfo[usuarioId]?.length || 0;
        if (indiceActual < totalContactos - 1) {
          return {
            ...prevIndices,
            [usuarioId]: indiceActual + 1
          };
        }
        return prevIndices;
      });
    }

    // 4. Mostrar mensaje
    toast({
      title: 'Tipificación Actualizada',
      description: nuevaTipificacion === 'contactado'
        ? `La tipificación ha sido actualizada a ${nuevaTipificacion}`
        : `La tipificación ha sido actualizada a ${nuevaTipificacion} y se ha avanzado al siguiente número`,
      duration: 2000,
    });
  };

  const handleSimularCredito = (usuarioId: number) => {
    toast({
      title: 'Simulación de Crédito',
      description: 'Iniciando la simulación de crédito para el cliente',
      duration: 3000,
    });
  };

  return {
    usuarioEnGestion,
    contactosInfo,
    indiceContactoActual,
    historialContactos,
    inicializarContactos,
    handleIniciarGestion,
    handleTipificacionChange,
    handleSimularCredito
  };
};
