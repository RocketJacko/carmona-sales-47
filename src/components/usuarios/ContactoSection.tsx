
import React from 'react';
import ContactoGestion from '@/components/usuarios/ContactoGestion';
import { Usuario } from '@/models';
import { ContactoInfo, HistorialContacto } from '@/components/usuarios/ContactoGestion';

interface ContactoSectionProps {
  usuarioId: number | null;
  usuarios: Usuario[];
  contactosInfo: Record<number, ContactoInfo[]>;
  indiceContactoActual: Record<number, number>;
  historialContactos: Record<number, HistorialContacto[]>;
  onTipificacionChange: (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => void;
  onSimularCredito: (usuarioId: number) => void;
  onMigrarACreditos: (usuarioId: number) => void;
  onMigrarAAgendamientos: (usuarioId: number, fechaAgendada: Date, observaciones: string, notas: string) => void;
}

const ContactoSection: React.FC<ContactoSectionProps> = ({
  usuarioId,
  usuarios,
  contactosInfo,
  indiceContactoActual,
  historialContactos,
  onTipificacionChange,
  onSimularCredito,
  onMigrarACreditos,
  onMigrarAAgendamientos
}) => {
  if (!usuarioId) return null;
  
  const usuario = usuarios.find(u => u.id === usuarioId);
  
  return (
    <div className="mt-10">
      <ContactoGestion 
        usuarioId={usuarioId}
        contactosInfo={contactosInfo}
        indiceContactoActual={indiceContactoActual}
        historialContactos={historialContactos}
        onTipificacionChange={onTipificacionChange}
        onSimularCredito={onSimularCredito}
        nombreUsuario={usuario?.nombre}
        onMigrarACreditos={onMigrarACreditos}
        onMigrarAAgendamientos={onMigrarAAgendamientos}
      />
    </div>
  );
};

export default ContactoSection;
