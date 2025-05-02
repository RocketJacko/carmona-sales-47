
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, History, Calendar, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactoHistorial from './ContactoHistorial';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/input";

// Interface for contact info
export interface ContactoInfo {
  id: number;
  pagaduria: string;
  movil: string;
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
  fechaGestion?: Date;
}

export interface HistorialContacto {
  id: number;
  movil: string;
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
  const totalContactos = contactosUsuario.length;
  
  // Calculate progress percentage
  const progressPercentage = Math.max(
    0, 
    Math.min(100, (indiceActual / (totalContactos - 1 || 1)) * 100)
  );

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
      description: `Segundo contacto agendado para ${format(fechaAgendamiento, 'PPP', { locale: es })}`,
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
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {/* Progress Indicator Section */}
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Progreso de contacto: {indiceActual + 1} de {totalContactos} números
                </div>
                <Badge 
                  variant={indiceActual === totalContactos - 1 ? "destructive" : "secondary"}
                  className="px-2 py-1"
                >
                  {indiceActual === totalContactos - 1 ? "Último número" : `${totalContactos - indiceActual - 1} restantes`}
                </Badge>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                style={{
                  backgroundColor: '#E2E8F0',
                  '--progress-bar-color': '#9b87f5'
                } as React.CSSProperties}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Pagaduría</label>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  {contactoActual.pagaduria}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Número de Contacto</label>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-medium">
                  {contactoActual.movil}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipificación</label>
                <select 
                  value={contactoActual.tipificacion}
                  onChange={(e) => onTipificacionChange(
                    usuarioId, 
                    e.target.value as ContactoInfo['tipificacion']
                  )}
                  className="w-full p-3 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                >
                  <option value="no contesta">No contesta</option>
                  <option value="equivocado">Equivocado</option>
                  <option value="fuera de servicio">Fuera de servicio</option>
                  <option value="contactado">Contactado</option>
                </select>
              </div>
              
              <div className="flex items-end">
                {contactoActual.tipificacion === 'contactado' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800 w-full transition-all duration-300"
                      >
                        Acciones <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
                        onClick={() => handleAccionChange('acepta')}
                      >
                        Acepta
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
                        onClick={() => handleAccionChange('segundo-contacto')}
                      >
                        Cierra Segundo Contacto
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer hover:bg-[#F5EFE6] text-gray-800"
                        onClick={() => handleAccionChange('no-acepta')}
                      >
                        No Acepta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                {indiceActual < (contactosUsuario.length - 1) ? (
                  <span>Hay {contactosUsuario.length - indiceActual - 1} número(s) adicional(es) disponible(s)</span>
                ) : (
                  <span>Este es el último número de contacto disponible</span>
                )}
              </p>
            </div>

            {/* Agendamiento Section */}
            {accionSeleccionada === 'segundo-contacto' && (
              <div className="mt-6 border-t pt-6 animate-fade-down">
                <h4 className="text-md font-semibold mb-4 text-gray-700 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Agendamiento de Segundo Contacto
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Fecha y Hora</label>
                    <div className="border rounded-md bg-white p-1">
                      <CalendarComponent
                        mode="single"
                        selected={fechaAgendamiento}
                        onSelect={setFechaAgendamiento}
                        className="rounded-md border-0"
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                    {fechaAgendamiento && (
                      <p className="mt-2 text-sm text-blue-600 font-medium">
                        Fecha seleccionada: {format(fechaAgendamiento, 'PPP', { locale: es })}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Observaciones de la oferta</label>
                      <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className="w-full p-3 text-sm rounded-md border border-gray-300 min-h-[100px]"
                        placeholder="Detalles de la oferta presentada al cliente..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Notas adicionales</label>
                      <textarea
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        className="w-full p-3 text-sm rounded-md border border-gray-300 min-h-[80px]"
                        placeholder="Notas adicionales sobre el agendamiento..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setAccionSeleccionada(null)}
                    variant="outline" 
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleGuardarAgendamiento}
                    className="bg-[#A5BECC] hover:bg-[#8EACBB] text-gray-800"
                  >
                    Guardar Agendamiento
                  </Button>
                </div>
              </div>
            )}

            {/* Radicación Section */}
            {accionSeleccionada === 'acepta' && (
              <div className="mt-6 border-t pt-6 animate-fade-down">
                <h4 className="text-md font-semibold mb-4 text-gray-700">Proceso de Radicación</h4>
                
                <div className="bg-[#F5EFE6] p-4 rounded-md mb-4">
                  <p className="text-sm">
                    El cliente ha aceptado la oferta. Puede proceder con el proceso de radicación.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setAccionSeleccionada(null)}
                    variant="outline" 
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleIniciarRadicacion}
                    className="bg-[#D4B483] hover:bg-[#C19A6B] text-gray-800"
                  >
                    Iniciar Radicación
                  </Button>
                </div>
              </div>
            )}
          </div>
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
