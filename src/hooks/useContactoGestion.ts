
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
      // Generar números móviles y fijos para ejemplificar
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
            numero: contactoActual.numero,
            tipo: contactoActual.tipo,
            tipificacion: nuevaTipificacion,
            fecha: new Date()
          }
        ];
        
        return nuevoHistorial;
      });
    }

    // Si la tipificación es "no contesta", "equivocado" o "fuera de servicio", pasamos al siguiente número automáticamente
    if (nuevaTipificacion === 'no contesta' || nuevaTipificacion === 'equivocado' || nuevaTipificacion === 'fuera de servicio') {
      const contactosUsuario = contactosInfo[usuarioId] || [];
      const indiceActual = indiceContactoActual[usuarioId];
      
      // Si hay más números disponibles, avanzamos al siguiente
      if (indiceActual < contactosUsuario.length - 1) {
        setIndiceContactoActual(prevIndices => ({
          ...prevIndices,
          [usuarioId]: indiceActual + 1
        }));
        
        const siguienteContacto = contactosUsuario[indiceActual + 1];
        const tipoTexto = siguienteContacto.tipo === 'movil' ? 'celular' : 'fijo';
        
        toast({
          title: 'Número Actualizado',
          description: `Se ha cambiado al siguiente número ${tipoTexto}: ${siguienteContacto.numero}`,
          duration: 2000,
        });
      }
    }

    // Mensajes de toast según la tipificación
    const mensajesToast = {
      'contactado': 'Cliente contactado exitosamente',
      'no contesta': 'El cliente no contesta',
      'equivocado': 'Número equivocado',
      'fuera de servicio': 'Número fuera de servicio'
    };
    
    toast({
      title: 'Tipificación Actualizada',
      description: mensajesToast[nuevaTipificacion] || `La tipificación ha sido actualizada a ${nuevaTipificacion}`,
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
