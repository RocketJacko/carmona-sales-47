
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContactoInfo, HistorialContacto } from '@/components/usuarios/ContactoGestion';

export const useContactoGestion = () => {
  const [usuarioEnGestion, setUsuarioEnGestion] = useState<number | null>(null);
  const [contactosInfo, setContactosInfo] = useState<Record<number, ContactoInfo[]>>({});
  const [indiceContactoActual, setIndiceContactoActual] = useState<Record<number, number>>({});
  const [historialContactos, setHistorialContactos] = useState<Record<number, HistorialContacto[]>>({});
  const { toast } = useToast();

  const inicializarContactos = (usuariosIds: number[]) => {
    const contactosIniciales: Record<number, ContactoInfo[]> = {};
    const indicesIniciales: Record<number, number> = {};
    const historialesIniciales: Record<number, HistorialContacto[]> = {};
    
    usuariosIds.forEach(id => {
      contactosIniciales[id] = [
        {
          id: 1,
          pagaduria: 'Empresa ABC',
          movil: '300' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        },
        {
          id: 2,
          pagaduria: 'Empresa XYZ',
          movil: '310' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        },
        {
          id: 3,
          pagaduria: 'Empresa DEF',
          movil: '320' + Math.floor(1000000 + Math.random() * 9000000),
          tipificacion: 'no contesta',
        }
      ];
      indicesIniciales[id] = 0; // Comenzamos con el primer número
      historialesIniciales[id] = []; // Inicializamos con historial vacío
    });
    
    setContactosInfo(contactosIniciales);
    setIndiceContactoActual(indicesIniciales);
    setHistorialContactos(historialesIniciales);
  };

  const handleIniciarGestion = (usuarioId: number) => {
    // Si ya hay una gestión activa, se cierra primero
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
    setContactosInfo(prevContactos => {
      const nuevosContactos = { ...prevContactos };
      const indiceActual = indiceContactoActual[usuarioId];
      
      if (nuevosContactos[usuarioId]) {
        // Actualizamos la tipificación del contacto actual
        nuevosContactos[usuarioId] = nuevosContactos[usuarioId].map((contacto, idx) => {
          if (idx === indiceActual) {
            return { 
              ...contacto, 
              tipificacion: nuevaTipificacion,
              fechaGestion: new Date()
            };
          }
          return contacto;
        });
      }
      
      return nuevosContactos;
    });

    // Agregamos entrada al historial
    const contactosUsuario = contactosInfo[usuarioId] || [];
    const indiceActual = indiceContactoActual[usuarioId] || 0;
    const contactoActual = contactosUsuario[indiceActual];

    if (contactoActual) {
      setHistorialContactos(prevHistorial => {
        const nuevoHistorial = { ...prevHistorial };
        const historiaUsuario = nuevoHistorial[usuarioId] || [];

        nuevoHistorial[usuarioId] = [
          ...historiaUsuario,
          {
            id: Date.now(), // Usamos timestamp como id único
            movil: contactoActual.movil,
            tipificacion: nuevaTipificacion,
            fecha: new Date()
          }
        ];
        
        return nuevoHistorial;
      });
    }

    // Si la tipificación es "no contesta" o "equivocado", pasamos al siguiente número automáticamente
    if (nuevaTipificacion === 'no contesta' || nuevaTipificacion === 'equivocado') {
      const contactosUsuario = contactosInfo[usuarioId] || [];
      const indiceActual = indiceContactoActual[usuarioId];
      
      // Si hay más números disponibles, avanzamos al siguiente
      if (indiceActual < contactosUsuario.length - 1) {
        setIndiceContactoActual(prevIndices => ({
          ...prevIndices,
          [usuarioId]: indiceActual + 1
        }));
        
        toast({
          title: 'Número Actualizado',
          description: `Se ha cambiado al siguiente número de contacto`,
          duration: 2000,
        });
      }
    }

    toast({
      title: 'Tipificación Actualizada',
      description: `La tipificación ha sido actualizada a ${nuevaTipificacion}`,
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
