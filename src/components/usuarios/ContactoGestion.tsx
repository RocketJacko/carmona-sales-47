import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { History, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactoHistorial from './ContactoHistorial';
import ContactoDetalles from './ContactoDetalles';
import ContactoAgendamiento from './ContactoAgendamiento';
import ContactoRadicacion from './ContactoRadicacion';
import { useEstadoStore } from '@/services/estado.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Interface for contact info
export interface ContactoInfo {
  id: number;
  pagaduria: string;
  tipo: 'movil' | 'fijo';
  numero: string;
  ciudad?: string; // Solo para teléfonos fijos
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
  fechaGestion?: Date;
}

export interface HistorialContacto {
  id: number;
  numero: string;
  tipo: 'movil' | 'fijo';
  tipificacion: ContactoInfo['tipificacion'];
  fecha: Date;
}

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
  onClose: () => void;
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
  onMigrarAAgendamientos,
  onClose
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("contacto");
  const [accionSeleccionada, setAccionSeleccionada] = useState<string | null>(null);
  const [fechaAgendamiento, setFechaAgendamiento] = useState<Date | undefined>(undefined);
  const [observaciones, setObservaciones] = useState<string>("");
  const [notas, setNotas] = useState<string>("");
  
  const { setClienteSeleccionado, actualizarTipificacion, actualizarAgendamiento } = useEstadoStore();

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

  const handleTipificacionChange = (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => {
    onTipificacionChange(usuarioId, nuevaTipificacion);
    actualizarTipificacion(nuevaTipificacion);
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
    
    actualizarAgendamiento(fechaAgendamiento, observaciones, notas);
    
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
    
    if (onMigrarACreditos && usuarioId) {
      onMigrarACreditos(usuarioId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Gestión de Contacto</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
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
              onTipificacionChange={handleTipificacionChange}
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

            {accionSeleccionada === 'radicacion' && (
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
      </CardContent>
    </Card>
  );
};

export default ContactoGestion;
