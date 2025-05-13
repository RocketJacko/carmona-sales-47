import React, { useCallback, memo, useMemo, useState } from 'react';
import { Phone, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { HistorialContacto } from './ContactoGestion';
import { ContactoInfo } from './ContactoGestion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useEstadoStore } from '@/services/estado.service';

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

// Componente para el número de teléfono
const NumeroTelefono = memo(({ numero }: { numero: string }) => (
  <div className="flex-grow">{numero}</div>
));

// Componente para el botón de WhatsApp
const BotonWhatsApp = memo(({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-9 rounded-md px-3 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
  >
    <MessageSquare className="h-4 w-4 mr-1" />
    WhatsApp
  </button>
));

// Componente contenedor del número
const ContenedorNumero = memo(({ numero, onWhatsAppClick }: {
  numero: string;
  onWhatsAppClick: () => void;
}) => {
  const numeroMemo = useMemo(() => numero, [numero]);
  const onClickMemo = useCallback(onWhatsAppClick, [onWhatsAppClick]);

  return (
    <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-200 font-medium">
      <NumeroTelefono numero={numeroMemo} />
      <BotonWhatsApp onClick={onClickMemo} />
    </div>
  );
});

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
  const { actualizarTipificacion, actualizarEstado } = useEstadoStore();
  const totalContactos = contactosUsuario.length;
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  
  const getTipificacionColor = useCallback((tipificacion: ContactoInfo['tipificacion']) => {
    switch (tipificacion) {
      case 'contactado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'no contesta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'equivocado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'fuera de servicio':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const handleTipificacionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaTipificacion = e.target.value as ContactoInfo['tipificacion'];
    onTipificacionChange(usuarioId, nuevaTipificacion);
  }, [usuarioId, onTipificacionChange]);

  const handleAccionChange = useCallback((accion: string) => {
    setAccionSeleccionada(accion);

    if (accion === 'no-acepta') {
      toast({
        title: 'Proceso finalizado',
        description: 'El cliente no ha aceptado la oferta',
        variant: 'default'
      });
    }
  }, [setAccionSeleccionada, toast]);

  const progreso = ((indiceActual + 1) / totalContactos) * 100;
  const contactosRestantes = totalContactos - (indiceActual + 1);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="mb-4 border-b pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-700">
            Progreso de contacto: {indiceActual + 1} de {totalContactos} números
          </div>
          <Badge variant="secondary">
            {contactosRestantes} restantes
          </Badge>
        </div>
        <Progress value={progreso} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Pagaduría</label>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            {contactoActual.pagaduria}
          </div>
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {contactoActual.tipo === 'movil' ? 'Número Celular' : 'Número Fijo'}
          </label>
          <ContenedorNumero 
            numero={contactoActual.numero}
            onWhatsAppClick={handleAbrirWhatsApp}
          />
        </div>
        
        {contactoActual.tipo === 'fijo' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Ciudad</label>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              {contactoActual.ciudad || "No especificada"}
            </div>
          </div>
        )}
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">Tipificación</label>
          <select 
            value={contactoActual.tipificacion}
            onChange={handleTipificacionChange}
            className="w-full p-3 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
          >
            <option value="contactado">Contactado</option>
            <option value="no contesta">No contesta</option>
            <option value="equivocado">Equivocado</option>
            <option value="fuera de servicio">Fuera de servicio</option>
          </select>
        </div>
        
        <div className="md:col-span-2 flex items-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={contactoActual.tipificacion !== 'contactado'}
                className="w-full p-3 text-sm rounded-md border border-gray-300 bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800 transition-all duration-300 h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
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
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Badge className={`${getTipificacionColor(contactoActual.tipificacion)} px-2 py-1`}>
            {contactoActual.tipificacion}
          </Badge>
          
          <span>
            {contactosRestantes > 0 ? (
              <span>Hay {contactosRestantes} número(s) adicional(es) disponible(s)</span>
            ) : (
              <span>Este es el último número de contacto disponible</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ContactoDetalles);
