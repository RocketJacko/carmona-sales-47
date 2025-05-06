
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { ContactoInfo } from './interfaces/ContactoInterfaces';
import ProgresoContacto from './contacto/ProgresoContacto';
import InfoContacto from './contacto/InfoContacto';
import TipificacionSelector from './contacto/TipificacionSelector';
import AccionesMenu from './contacto/AccionesMenu';
import TipificacionBadge from './contacto/TipificacionBadge';

interface ContactoDetallesProps {
  usuarioId: number;
  contactoActual: ContactoInfo;
  contactosUsuario: ContactoInfo[];
  indiceActual: number;
  onTipificacionChange: (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => void;
  accionSeleccionada: string | null;
  setAccionSeleccionada: (accion: string | null) => void;
  handleAbrirWhatsApp: () => void;
}

const ContactoDetalles: React.FC<ContactoDetallesProps> = ({
  usuarioId,
  contactoActual,
  contactosUsuario,
  indiceActual,
  onTipificacionChange,
  accionSeleccionada,
  setAccionSeleccionada,
  handleAbrirWhatsApp
}) => {
  const { toast } = useToast();
  const totalContactos = contactosUsuario.length;

  const handleAccionChange = (accion: string) => {
    setAccionSeleccionada(accion);

    if (accion === 'no-acepta') {
      toast({
        title: 'Proceso finalizado',
        description: 'El cliente no ha aceptado la oferta',
        variant: 'default'
      });
      // Aquí se podría implementar la lógica para cerrar el proceso
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Progress Indicator Section */}
      <ProgresoContacto 
        indiceActual={indiceActual} 
        totalContactos={totalContactos} 
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Contact Information Fields */}
        <InfoContacto 
          contactoActual={contactoActual}
          handleAbrirWhatsApp={handleAbrirWhatsApp}
        />
        
        {/* Tipification Dropdown */}
        <TipificacionSelector 
          tipificacion={contactoActual.tipificacion}
          onTipificacionChange={(nuevaTipificacion) => onTipificacionChange(usuarioId, nuevaTipificacion)}
        />
        
        {/* Actions Dropdown Menu */}
        <AccionesMenu 
          onAccionChange={handleAccionChange}
          mostrar={contactoActual.tipificacion === 'contactado'}
        />
      </div>
      
      {/* Status Badge and Remaining Contacts Info */}
      <TipificacionBadge 
        tipificacion={contactoActual.tipificacion}
        indiceActual={indiceActual}
        totalContactos={totalContactos}
      />
    </div>
  );
};

export default ContactoDetalles;
