
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface RadicacionFormProps {
  usuarioId: number;
  nombreUsuario?: string;
  onClose: () => void;
}

const RadicacionForm: React.FC<RadicacionFormProps> = ({ usuarioId, nombreUsuario, onClose }) => {
  const { toast } = useToast();
  const [numeroRadicacion, setNumeroRadicacion] = useState('');
  const [fechaRadicacion, setFechaRadicacion] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroRadicacion || !fechaRadicacion) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'destructive'
      });
      return;
    }
    
    // Aquí se implementaría la lógica para enviar los datos a la base de datos
    setTimeout(() => {
      setEnviado(true);
      toast({
        title: 'Radicación exitosa',
        description: `La solicitud ha sido radicada con el número ${numeroRadicacion}`,
        variant: 'default'
      });
    }, 1000);
  };

  return (
    <Card className="w-full border-none shadow-lg rounded-xl mt-10 animate-fade-down">
      <CardHeader className="bg-[#F5EFE6] rounded-t-xl">
        <CardTitle className="text-xl font-semibold text-gray-800">Radicación de Solicitud</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!enviado ? (
          <form onSubmit={handleSubmit}>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-blue-800">Cliente: {nombreUsuario || 'Cliente seleccionado'}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Número de Radicación</label>
                <Input 
                  type="text" 
                  value={numeroRadicacion}
                  onChange={(e) => setNumeroRadicacion(e.target.value)}
                  placeholder="Ingrese número de radicación"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Fecha de Radicación</label>
                <Input 
                  type="date" 
                  value={fechaRadicacion}
                  onChange={(e) => setFechaRadicacion(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#D4B483] hover:bg-[#C19A6B] text-gray-800"
              >
                Radicar Solicitud
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-10 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Radicación Exitosa</h3>
              <p className="text-gray-600 mb-6">
                La solicitud ha sido radicada correctamente con el número {numeroRadicacion}
              </p>
              <Button 
                onClick={onClose}
                className="bg-[#A5BECC] hover:bg-[#8EACBB] text-gray-800"
              >
                Volver a la gestión de clientes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RadicacionForm;
