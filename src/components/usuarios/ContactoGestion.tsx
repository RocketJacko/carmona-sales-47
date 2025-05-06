
import React, { useState } from 'react';
import { History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactoHistorial from './ContactoHistorial';
import ContactoDetalles from './ContactoDetalles';
import ContactoAgendamiento from './ContactoAgendamiento';
import ContactoRadicacion from './ContactoRadicacion';
import { ContactoInfo, HistorialContacto } from './interfaces/ContactoInterfaces';

interface ContactoGestionProps {
  usuarioId: number | null;
  contactosInfo: Record<number, ContactoInfo[]>;
  indiceContactoActual: Record<number, number>;
  historialContactos: Record<number, HistorialContacto[]>;
  onTipificacionChange: (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => void;
  onSimularCredito: (usuarioId: number) => void;
  nombreUsuario?: string;
  onMigrarACreditos?: (usuarioId: number) => void;
  onMigrarAAgendamientos?: (usuarioId: number, fechaAgendada: Date, observaciones: string, notas: string) => void;
}

const ContactoGestion: React.FC<ContactoGestionProps> = ({
  usuarioId,
  contactosInfo,
  indiceContactoActual,
  historialContactos,
  onTipificacionChange,
  onSimularCredito,
  nombreUsuario,
  onMigrarACreditos,
  onMigrarAAgendamientos
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("contacto");
  const [accionSeleccionada, setAccionSeleccionada] = useState<string | null>(null);
  const [fechaAgendamiento, setFechaAgendamiento] = useState<Date | undefined>(undefined);
  const [observaciones, setObservaciones] = useState<string>("");
  const [notas, setNotas] = useState<string>("");

  if (!usuarioId) return null;

  const obtenerContactoActual = (id: number) => {
    const contactos = contactosInfo[id] || [];
    const indice = indiceContactoActual[id] || 0;
    return contactos[indice] || null;
  };

  const contactoActual = obtenerContactoActual(usuarioId);
  
  if (!contactoActual) {
    return (
      <div className="text-center py-4">No hay información de contacto disponible</div>
    );
  }

  const contactosUsuario = contactosInfo[usuarioId] || [];
  const indiceActual = indiceContactoActual[usuarioId] || 0;

  // Abre WhatsApp con el número seleccionado
  const handleAbrirWhatsApp = () => {
    if (contactoActual.tipo === 'movil') {
      const numero = contactoActual.numero.replace(/\D/g, ''); // Elimina caracteres no numéricos
      const whatsappUrl = `https://wa.me/${numero}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: 'WhatsApp iniciado',
        description: `Abriendo chat de WhatsApp para el número ${contactoActual.numero}`,
        variant: 'default'
      });
    }
  };

  const handleGuardarAgendamiento = () => {
    if (!fechaAgendamiento) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar una fecha para el agendamiento',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Agendamiento guardado',
      description: `Segundo contacto agendado para ${fechaAgendamiento.toLocaleDateString()}`,
      variant: 'default'
    });
    
    // Migrate to Agendamientos section
    if (onMigrarAAgendamientos && usuarioId) {
      onMigrarAAgendamientos(usuarioId, fechaAgendamiento, observaciones, notas);
    }
    
    setAccionSeleccionada(null);
  };

  const handleIniciarRadicacion = () => {
    toast({
      title: 'Radicación iniciada',
      description: 'Se ha iniciado el proceso de radicación',
      variant: 'default'
    });
    
    // Migrate to Creditos section
    if (onMigrarACreditos && usuarioId) {
      onMigrarACreditos(usuarioId);
    }
  };

  return (
    <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50 animate-fade-down">
      <h3 className="text-lg font-semibold mb-3 text-blue-800">
        Información de Contacto - {nombreUsuario}
      </h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="contacto">Contacto Actual</TabsTrigger>
          <TabsTrigger value="historial" className="flex items-center">
            <History className="mr-1 h-4 w-4" />
            Historial ({historialContactos[usuarioId]?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacto" className="mt-0">
          <ContactoDetalles
            usuarioId={usuarioId}
            contactoActual={contactoActual}
            contactosUsuario={contactosUsuario}
            indiceActual={indiceActual}
            onTipificacionChange={onTipificacionChange}
            accionSeleccionada={accionSeleccionada}
            setAccionSeleccionada={setAccionSeleccionada}
            handleAbrirWhatsApp={handleAbrirWhatsApp}
          />

          {/* Conditional sections based on selected action */}
          {accionSeleccionada === 'segundo-contacto' && (
            <ContactoAgendamiento
              fechaAgendamiento={fechaAgendamiento}
              setFechaAgendamiento={setFechaAgendamiento}
              observaciones={observaciones}
              setObservaciones={setObservaciones}
              notas={notas}
              setNotas={setNotas}
              onGuardarAgendamiento={handleGuardarAgendamiento}
              onCancelar={() => setAccionSeleccionada(null)}
            />
          )}

          {accionSeleccionada === 'acepta' && (
            <ContactoRadicacion
              onIniciarRadicacion={handleIniciarRadicacion}
              onCancelar={() => setAccionSeleccionada(null)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="historial" className="mt-0">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <ContactoHistorial 
              usuarioId={usuarioId} 
              historialContactos={historialContactos[usuarioId] || []} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactoGestion;
