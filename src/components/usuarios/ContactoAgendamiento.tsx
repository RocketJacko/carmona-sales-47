
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContactoAgendamientoProps {
  fechaAgendamiento: Date | undefined;
  setFechaAgendamiento: (fecha: Date | undefined) => void;
  observaciones: string;
  setObservaciones: (text: string) => void;
  notas: string;
  setNotas: (text: string) => void;
  onGuardarAgendamiento: () => void;
  onCancelar: () => void;
}

const ContactoAgendamiento: React.FC<ContactoAgendamientoProps> = ({
  fechaAgendamiento,
  setFechaAgendamiento,
  observaciones,
  setObservaciones,
  notas,
  setNotas,
  onGuardarAgendamiento,
  onCancelar
}) => {
  return (
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
          onClick={onCancelar}
          variant="outline" 
          className="mr-2"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onGuardarAgendamiento}
          className="bg-[#A5BECC] hover:bg-[#8EACBB] text-gray-800"
        >
          Guardar Agendamiento
        </Button>
      </div>
    </div>
  );
};

export default ContactoAgendamiento;
