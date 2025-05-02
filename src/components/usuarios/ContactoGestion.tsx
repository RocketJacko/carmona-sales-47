
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Interface for contact info
export interface ContactoInfo {
  id: number;
  pagaduria: string;
  movil: string;
  tipificacion: 'no contesta' | 'equivocado' | 'fuera de servicio' | 'contactado';
}

interface ContactoGestionProps {
  usuarioId: number | null;
  contactosInfo: Record<number, ContactoInfo[]>;
  indiceContactoActual: Record<number, number>;
  onTipificacionChange: (usuarioId: number, nuevaTipificacion: ContactoInfo['tipificacion']) => void;
  onSimularCredito: (usuarioId: number) => void;
  nombreUsuario?: string;
}

const ContactoGestion: React.FC<ContactoGestionProps> = ({
  usuarioId,
  contactosInfo,
  indiceContactoActual,
  onTipificacionChange,
  onSimularCredito,
  nombreUsuario
}) => {
  const { toast } = useToast();

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

  return (
    <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50 animate-fade-down">
      <h3 className="text-lg font-semibold mb-3 text-blue-800">
        Información de Contacto - {nombreUsuario}
      </h3>
      
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
            <Button 
              onClick={() => onSimularCredito(usuarioId)}
              disabled={contactoActual.tipificacion !== 'contactado'}
              className={`bg-[#F97316] hover:bg-orange-600 text-white w-full transition-all duration-300 transform hover:scale-105 ${contactoActual.tipificacion !== 'contactado' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="mr-2 h-4 w-4" />
              Simular Crédito
            </Button>
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
      </div>
    </div>
  );
};

export default ContactoGestion;
