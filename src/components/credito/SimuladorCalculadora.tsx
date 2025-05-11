
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface ResultadosCalculados {
  capacidadLibreInversion: number;
  capacidadCompraCartera: number;
  fullCapacidad: number;
}

interface SimuladorCalculadoraProps {
  nombreUsuario?: string;
  onContactar: () => void;
  onResultadosCalculados: (resultados: ResultadosCalculados) => void;
}

const SimuladorCalculadora: React.FC<SimuladorCalculadoraProps> = ({ 
  nombreUsuario, 
  onContactar,
  onResultadosCalculados
}) => {
  const [ingreso, setIngreso] = useState("");
  const [salud, setSalud] = useState("0");
  const [carterasAComprar, setCarterasAComprar] = useState("");
  const [otrosDescuentos, setOtrosDescuentos] = useState("");
  const [resultadosCalculados, setResultadosCalculados] = useState<ResultadosCalculados | null>(null);

  // Formateador de moneda colombiana
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleIngresoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setIngreso(valor);
    
    if (valor) {
      const ingresoNum = parseFloat(valor);
      let valorSalud = 0;
      
      if (ingresoNum < 1423500) {
        valorSalud = ingresoNum * 0.04;
      } else if (ingresoNum < 4270500) {
        valorSalud = ingresoNum * 0.10;
      } else {
        valorSalud = ingresoNum * 0.12;
      }
      
      setSalud(valorSalud.toFixed(0));
    } else {
      setSalud("0");
    }
  };

  const calcularResultados = () => {
    if (!ingreso || !carterasAComprar || !otrosDescuentos) {
      return;
    }
    
    const ingresoNum = parseFloat(ingreso);
    const saludNum = parseFloat(salud);
    const carterasNum = parseFloat(carterasAComprar);
    const otrosNum = parseFloat(otrosDescuentos);
    
    const capacidadLibreInversion = ((ingresoNum - saludNum) / 2) - (otrosNum + carterasNum);
    const capacidadCompraCartera = ((ingresoNum - saludNum) / 2) - otrosNum;
    const fullCapacidad = (ingresoNum - saludNum) / 2;
    
    const resultados = {
      capacidadLibreInversion,
      capacidadCompraCartera,
      fullCapacidad
    };
    
    setResultadosCalculados(resultados);
    onResultadosCalculados(resultados);
  };

  return (
    <>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-blue-800">Cliente: {nombreUsuario || 'Cliente seleccionado'}</h4>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-semibold mb-4 text-gray-700">Calculadora Financiera</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ingreso</label>
            <Input 
              type="number" 
              value={ingreso}
              onChange={handleIngresoChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Salud (Calculado automáticamente)
            </label>
            <Input 
              type="text" 
              value={salud}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Carteras a comprar</label>
            <Input 
              type="number" 
              value={carterasAComprar}
              onChange={(e) => setCarterasAComprar(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Otros descuentos</label>
            <Input 
              type="number" 
              value={otrosDescuentos}
              onChange={(e) => setOtrosDescuentos(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={calcularResultados}
          className="bg-[#A5BECC] hover:bg-[#8EACBB] text-gray-800"
        >
          Calcular
        </Button>
        
        {resultadosCalculados && (
          <div className="mt-6 border rounded-lg overflow-hidden bg-white">
            <h5 className="font-medium m-4">Resultados:</h5>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alternativa</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Capacidad Libre Inversión</TableCell>
                  <TableCell className="font-bold">{formatCurrency(resultadosCalculados.capacidadLibreInversion)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Capacidad Compra de Cartera</TableCell>
                  <TableCell className="font-bold">{formatCurrency(resultadosCalculados.capacidadCompraCartera)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Full Capacidad</TableCell>
                  <TableCell className="font-bold">{formatCurrency(resultadosCalculados.fullCapacidad)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="flex justify-end p-4">
              <Button 
                onClick={onContactar}
                className="bg-[#D4B483] hover:bg-[#C19A6B] text-gray-800"
              >
                Contactar <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SimuladorCalculadora;
