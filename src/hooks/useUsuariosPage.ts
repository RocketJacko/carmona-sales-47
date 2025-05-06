
import { useState } from 'react';
import { useUsuariosBusqueda } from '@/hooks/useUsuariosBusqueda';
import { useContactoGestion } from '@/hooks/useContactoGestion';
import { useSimuladorWorkflow } from '@/hooks/useSimuladorWorkflow';

export function useUsuariosPage() {
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  
  // Use our custom hooks
  const usuariosBusqueda = useUsuariosBusqueda();
  const contactoGestion = useContactoGestion();
  const simuladorWorkflow = useSimuladorWorkflow();
  
  // Initialize contact information when users are loaded
  if (usuariosBusqueda.usuarios.length > 0 && Object.keys(contactoGestion.contactosInfo).length === 0) {
    contactoGestion.inicializarContactos(usuariosBusqueda.usuarios.map(u => u.id));
  }

  // When starting management, directly show the simulator
  const handleIniciarGestionUsuario = (userId: number) => {
    contactoGestion.handleIniciarGestion(userId);
    simuladorWorkflow.handleClickSimularCredito(userId);
  };

  const handleClickSimularCredito = (userId: number) => {
    contactoGestion.handleSimularCredito(userId);
    simuladorWorkflow.handleClickSimularCredito(userId);
  };

  return {
    ...usuariosBusqueda,
    ...simuladorWorkflow,
    contactoGestion,
    hoveredRowId,
    setHoveredRowId,
    handleIniciarGestionUsuario,
    handleClickSimularCredito,
  };
}
