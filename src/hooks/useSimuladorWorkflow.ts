
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useSimuladorWorkflow() {
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [mostrarRadicacion, setMostrarRadicacion] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClickSimularCredito = (userId: number) => {
    setMostrarSimulador(true);
    setMostrarContacto(false);
    setMostrarRadicacion(false);
  };

  const handleCerrarSimulador = () => {
    setMostrarSimulador(false);
    setMostrarContacto(false);
    setMostrarRadicacion(false);
  };
  
  const handleIniciarContacto = () => {
    setMostrarContacto(true);
  };

  const handleMostrarRadicacion = () => {
    setMostrarRadicacion(true);
  };
  
  const handleCerrarRadicacion = () => {
    setMostrarRadicacion(false);
    setMostrarSimulador(false);
    setMostrarContacto(false);
  };

  // Handler for migrating clients to Creditos section
  const handleMigrarACreditos = (usuarioId: number) => {
    toast({
      title: 'Cliente migrado a Créditos',
      description: 'El cliente ha sido migrado a la sección de Créditos',
      variant: 'default'
    });
    
    // Navigate to the creditos page after a short delay
    setTimeout(() => {
      navigate('/crm/creditos');
    }, 1500);
  };

  // Handler for migrating clients to Agendamientos section
  const handleMigrarAAgendamientos = (usuarioId: number, fechaAgendada: Date, observaciones: string, notas: string) => {
    toast({
      title: 'Cliente migrado a Agendamientos',
      description: `El cliente ha sido agendado para ${fechaAgendada.toLocaleDateString()}`,
      variant: 'default'
    });
    
    // Navigate to the agendamientos page after a short delay
    setTimeout(() => {
      navigate('/crm/agendamientos');
    }, 1500);
  };

  return {
    mostrarSimulador,
    mostrarContacto,
    mostrarRadicacion,
    handleClickSimularCredito,
    handleCerrarSimulador,
    handleIniciarContacto,
    handleMostrarRadicacion,
    handleCerrarRadicacion,
    handleMigrarACreditos,
    handleMigrarAAgendamientos
  };
}
