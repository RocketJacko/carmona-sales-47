
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ConceptoRetroactivo {
  concepto: string;
  tipoConcepto: string;
  pago: number;
  descuento: number;
}

interface SimuladorCreditoProps {
  usuarioId: number | null;
  nombreUsuario?: string;
  onClose: () => void;
}

const conceptosEjemplo: ConceptoRetroactivo[] = [
  { concepto: 'RETROACTIVO', tipoConcepto: 'P', pago: 153500, descuento: 0 },
  { concepto: 'APORTE DE LEY', tipoConcepto: 'D', pago: 0, descuento: 325892 },
  { concepto: 'TORRES GUARIN Y CIA LTDA', tipoConcepto: 'D', pago: 0, descuento: 15667 }
];

const SimuladorCredito: React.FC<SimuladorCreditoProps> = ({ usuarioId, nombreUsuario, onClose }) => {
  const [activeTab, setActiveTab] = useState("informacion");
  const [entidadOfertada, setEntidadOfertada] = useState("");
  const [monto, setMonto] = useState("");
  const [ingreso, setIngreso] = useState("");
  const [salud, setSalud] = useState("0");
  const [carterasAComprar, setCarterasAComprar] = useState("");
  const [otrosDescuentos, setOtrosDescuentos] = useState("");
  const [resultadosCalculados, setResultadosCalculados] = useState<{
    capacidadLibreInversion: number;
    capacidadCompraCartera: number;
    fullCapacidad: number;
  } | null>(null);
  
  const continuarHabilitado = entidadOfertada.trim() !== "" && monto.trim() !== "";
  
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
    
    setResultadosCalculados({
      capacidadLibreInversion,
      capacidadCompraCartera,
      fullCapacidad
    });
  };
  
  // Formateador de moneda colombiana
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Card className="w-full bg-white/90 border-none shadow-lg rounded-xl mt-6 mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Simulación de Crédito</h3>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacion">Información Inicial</TabsTrigger>
            <TabsTrigger value="calculadora" disabled={!continuarHabilitado}>Calculadora</TabsTrigger>
            <TabsTrigger value="contacto" disabled={!resultadosCalculados}>Contacto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacion" className="mt-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Cliente: {nombreUsuario || 'Cliente seleccionado'}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Entidad Ofertada</label>
                <Input 
                  type="text" 
                  value={entidadOfertada}
                  onChange={(e) => setEntidadOfertada(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Monto</label>
                <Input 
                  type="number" 
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Conceptos</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead>Descuento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conceptosEjemplo.map((concepto, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{concepto.concepto}</TableCell>
                        <TableCell>
                          <Badge variant={concepto.tipoConcepto === 'P' ? 'default' : 'outline'}>
                            {concepto.tipoConcepto}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(concepto.pago)}</TableCell>
                        <TableCell>{formatCurrency(concepto.descuento)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={onClose}>Guardar</Button>
              <Button 
                onClick={() => setActiveTab("calculadora")} 
                disabled={!continuarHabilitado}
                className={`bg-[#9b87f5] hover:bg-[#8a76e4] text-white`}
              >
                Continuar <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="calculadora" className="mt-4">
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
                className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white"
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
                      onClick={() => setActiveTab("contacto")}
                      className="bg-[#F97316] hover:bg-orange-600 text-white"
                    >
                      Contactar <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contacto" className="mt-4">
            {resultadosCalculados && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-800 mb-3">Cliente: {nombreUsuario || 'Cliente seleccionado'}</h4>
                  
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Propuestas disponibles:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <h6 className="text-xs font-medium text-gray-500">Libre Inversión</h6>
                        <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.capacidadLibreInversion)}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h6 className="text-xs font-medium text-gray-500">Compra de Cartera</h6>
                        <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.capacidadCompraCartera)}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h6 className="text-xs font-medium text-gray-500">Full Capacidad</h6>
                        <p className="text-lg font-bold">{formatCurrency(resultadosCalculados.fullCapacidad)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-4 text-gray-700">Contacto</h4>
                  
                  <div>
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Check className="h-12 w-12 text-green-500 mb-4" />
                        <p className="text-lg font-medium">Simulación completada exitosamente</p>
                        <p className="text-gray-500 mt-2">
                          Ahora puede proceder al contacto del cliente utilizando la sección de gestión de contactos
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" onClick={onClose}>
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default SimuladorCredito;
