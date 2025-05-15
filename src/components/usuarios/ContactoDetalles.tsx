import React, { useCallback, memo, useMemo, useState } from 'react';
import { Phone, MessageSquare, Calendar, FileText, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
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
  <div className="relative group">
    <button
      onClick={onClick}
      className="ml-2 flex items-center justify-center rounded-full p-2 bg-green-500 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
      aria-label="Abrir WhatsApp"
      type="button"
    >
      {/* Icono oficial de WhatsApp SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="currentColor" className="text-white">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.34 7.09L4 29l7.18-2.31A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.13 0-4.21-.62-5.97-1.79l-.43-.27-4.27 1.37 1.4-4.16-.28-.44A9.93 9.93 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.29-7.38c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.22.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z"/>
      </svg>
    </button>
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">Contactar por WhatsApp</span>
  </div>
));

// Componente contenedor del número
const ContenedorNumero = memo(({ numero, onWhatsAppClick }: {
  numero: string;
  onWhatsAppClick: () => void;
}) => {
  const numeroMemo = useMemo(() => numero, [numero]);
  const onClickMemo = useCallback(onWhatsAppClick, [onWhatsAppClick]);

  return (
    <div className="flex items-center bg-gray-50 px-4 py-0 rounded-md border border-gray-200 font-medium w-full min-w-0 h-[48px]">
      <span className="flex-1 truncate text-base">{numeroMemo}</span>
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
          <div className="text-sm font-medium text-gray-700">
            Progreso de contacto: {indiceActual + 1} de {totalContactos} números
          </div>
          <Badge variant="secondary">
            {contactosRestantes} restantes
          </Badge>
        </div>
        <Progress value={progreso} className="h-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6 items-stretch">
        {/* Pagaduría */}
        <div className="xl:col-span-1 lg:col-span-1 sm:col-span-1 col-span-1 flex flex-col justify-end">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pagaduría</label>
          <div className="bg-gray-50 px-4 py-0 rounded-md border border-gray-200 truncate text-base h-[48px] flex items-center">{contactoActual.pagaduria}</div>
        </div>
        {/* Número y WhatsApp */}
        <div className="xl:col-span-1 lg:col-span-1 sm:col-span-1 col-span-1 flex flex-col justify-end">
          <label className="block text-sm font-semibold text-gray-700 mb-1">{contactoActual.tipo === 'movil' ? 'Número Celular' : 'Número Fijo'}</label>
          <ContenedorNumero 
            numero={contactoActual.numero}
            onWhatsAppClick={handleAbrirWhatsApp}
          />
        </div>
        {/* Ciudad */}
        {contactoActual.tipo === 'fijo' && (
          <div className="xl:col-span-1 lg:col-span-1 sm:col-span-1 col-span-1 flex flex-col justify-end">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
            <div className="bg-gray-50 px-4 py-0 rounded-md border border-gray-200 text-base h-[48px] flex items-center">{contactoActual.ciudad || "No especificada"}</div>
          </div>
        )}
        {/* Tipificación */}
        <div className="xl:col-span-1 lg:col-span-1 sm:col-span-1 col-span-1 flex flex-col justify-end">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tipificación</label>
          <select 
            value={contactoActual.tipificacion}
            onChange={handleTipificacionChange}
            className="w-full px-4 py-0 text-base rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm h-[48px]"
          >
            <option value="contactado">Contactado</option>
            <option value="no contesta">No contesta</option>
            <option value="equivocado">Equivocado</option>
            <option value="fuera de servicio">Fuera de servicio</option>
          </select>
        </div>
        {/* Botón de acciones */}
        <div className="flex items-end justify-center sm:justify-end col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-1 mt-2 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={contactoActual.tipificacion !== 'contactado'}
                className="min-w-[140px] px-4 py-0 text-base rounded-md border border-gray-300 bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800 transition-all duration-300 h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Badge className={`${getTipificacionColor(contactoActual.tipificacion)} px-2 py-1 flex items-center gap-1`}>
            {contactoActual.tipificacion === 'contactado' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {contactoActual.tipificacion === 'no contesta' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
            {contactoActual.tipificacion === 'equivocado' && <XCircle className="w-4 h-4 text-red-600" />}
            {contactoActual.tipificacion === 'fuera de servicio' && <Info className="w-4 h-4 text-gray-600" />}
            {contactoActual.tipificacion}
          </Badge>
          <span className="flex items-center gap-1">
            <Info className="w-4 h-4 text-blue-400" />
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
