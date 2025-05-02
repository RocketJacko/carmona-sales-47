
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContactoRadicacionProps {
  onIniciarRadicacion: () => void;
  onCancelar: () => void;
}

const ContactoRadicacion: React.FC<ContactoRadicacionProps> = ({
  onIniciarRadicacion,
  onCancelar
}) => {
  return (
    <div className="mt-6 border-t pt-6 animate-fade-down">
      <h4 className="text-md font-semibold mb-4 text-gray-700">Proceso de Radicación</h4>
      
      <div className="bg-[#F5EFE6] p-4 rounded-md mb-4">
        <p className="text-sm">
          El cliente ha aceptado la oferta. Puede proceder con el proceso de radicación.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onCancelar}
          variant="outline" 
          className="mr-2"
        >
          Cancelar
        </Button>
        <Button 
          onClick={onIniciarRadicacion}
          className="bg-[#D4B483] hover:bg-[#C19A6B] text-gray-800"
        >
          Iniciar Radicación
        </Button>
      </div>
    </div>
  );
};

export default ContactoRadicacion;
