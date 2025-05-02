
import React from 'react';
import { Phone } from 'lucide-react';
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

  // Obtiene el color para el badge de tipificación
  const getTipificacionColor = (tipificacion: ContactoInfo['tipificacion']) => {
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
  };

  return (
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
          <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-200 font-medium">
            <span className="flex-grow">{contactoActual.numero}</span>
            
            {/* WhatsApp button for mobile numbers */}
            {contactoActual.tipo === 'movil' && (
              <button 
                onClick={handleAbrirWhatsApp}
                className="ml-2 p-1.5 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                title="Abrir WhatsApp"
                aria-label="Abrir WhatsApp"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-green-600" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Ciudad solo para números fijos */}
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
            onChange={(e) => onTipificacionChange(
              usuarioId, 
              e.target.value as ContactoInfo['tipificacion']
            )}
            className="w-full p-3 text-sm rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
          >
            <option value="contactado">Contactado</option>
            <option value="no contesta">No contesta</option>
            <option value="equivocado">Equivocado</option>
            <option value="fuera de servicio">Fuera de servicio</option>
          </select>
        </div>
        
        <div className="md:col-span-2 flex items-end">
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
        <div className="flex items-center space-x-2">
          <Badge className={`${getTipificacionColor(contactoActual.tipificacion)} px-2 py-1`}>
            {contactoActual.tipificacion}
          </Badge>
          
          <span>
            {indiceActual < (contactosUsuario.length - 1) ? (
              <span>Hay {contactosUsuario.length - indiceActual - 1} número(s) adicional(es) disponible(s)</span>
            ) : (
              <span>Este es el último número de contacto disponible</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactoDetalles;
