
import React from 'react';
import SimuladorCredito from '@/components/credito/SimuladorCredito';
import ContactoGestion from '@/components/usuarios/ContactoGestion';
import RadicacionForm from '@/components/credito/RadicacionForm';
import { Usuario } from '@/models';
import { ContactoInfo, HistorialContacto } from '@/components/usuarios/ContactoGestion';

interface SimuladorWorkflowProps {
  mostrarSimulador: boolean;
  mostrarContacto: boolean;
  mostrarRadicacion: boolean;
  usuarioEnGestion: number | null;
  usuarios: Usuario[];
  contactosInfo: Record<number, ContactoInfo[]>;
  indiceContactoActual: Record<number, number>;
  historialContactos: Record<number, HistorialContacto[]>;
  onCerrarSimulador: () => void;
  onInitiarContacto: () => void;
  onClickSimularCredito: (userId: number) => void;
  onTipificacionChange: (userId: number, tipificacion: ContactoInfo['tipificacion']) => void;
  onMigrarACreditos: (usuarioId: number) => void;
  onMigrarAAgendamientos: (usuarioId: number, fechaAgendada: Date, observaciones: string, notas: string) => void;
  onCerrarRadicacion: () => void;
}

const SimuladorWorkflow: React.FC<SimuladorWorkflowProps> = ({
  mostrarSimulador,
  mostrarContacto,
  mostrarRadicacion,
  usuarioEnGestion,
  usuarios,
  contactosInfo,
  indiceContactoActual,
  historialContactos,
  onCerrarSimulador,
  onInitiarContacto,
  onClickSimularCredito,
  onTipificacionChange,
  onMigrarACreditos,
  onMigrarAAgendamientos,
  onCerrarRadicacion
}) => {
  if (!usuarioEnGestion) return null;
  
  const usuarioActual = usuarios.find(u => u.id === usuarioEnGestion);
  const nombreUsuario = usuarioActual?.nombre;

  return (
    <>
      {/* Credit Simulator - shown when user clicks "Iniciar Gestión" */}
      {mostrarSimulador && (
        <div className="mt-10">
          <SimuladorCredito
            usuarioId={usuarioEnGestion}
            nombreUsuario={nombreUsuario}
            onClose={onCerrarSimulador}
            onContactar={onInitiarContacto}
          />
        </div>
      )}

      {/* Contact section - only shown after "Contactar" from the simulator is clicked */}
      {mostrarContacto && (
        <div className="mt-10">
          <ContactoGestion 
            usuarioId={usuarioEnGestion}
            contactosInfo={contactosInfo}
            indiceContactoActual={indiceContactoActual}
            historialContactos={historialContactos}
            onTipificacionChange={onTipificacionChange}
            onSimularCredito={onClickSimularCredito}
            nombreUsuario={nombreUsuario}
            onMigrarACreditos={onMigrarACreditos}
            onMigrarAAgendamientos={onMigrarAAgendamientos}
          />
        </div>
      )}
      
      {/* Radicación section - shown when "Acepta" is selected in the contact dropdown */}
      {mostrarRadicacion && (
        <RadicacionForm
          usuarioId={usuarioEnGestion}
          nombreUsuario={nombreUsuario}
          onClose={onCerrarRadicacion}
        />
      )}
    </>
  );
};

export default SimuladorWorkflow;
