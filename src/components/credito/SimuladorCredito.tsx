import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConsumoApsi } from '@/services/consumoApsi';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import SimuladorInformacionInicial from './SimuladorInformacionInicial';
import SimuladorCalculadora from './SimuladorCalculadora';
import SimuladorContacto from './SimuladorContacto';

interface ConceptoRetroactivo {
  concepto: string;
  tipoConcepto: string;
  pago: number;
  descuento: number;
}

interface ResultadosCalculados {
  capacidadLibreInversion: number;
  capacidadCompraCartera: number;
  fullCapacidad: number;
}

interface SimuladorCreditoProps {
  usuarioId: number | string | null;
  nombreUsuario?: string;
  conceptos: any[];
  onClose: () => void;
  onContactar: () => void;
}

const conceptosEjemplo: ConceptoRetroactivo[] = [
  { concepto: 'RETROACTIVO', tipoConcepto: 'P', pago: 153500, descuento: 0 },
  { concepto: 'APORTE DE LEY', tipoConcepto: 'D', pago: 0, descuento: 325892 },
  { concepto: 'TORRES GUARIN Y CIA LTDA', tipoConcepto: 'D', pago: 0, descuento: 15667 }
];

const SimuladorCredito: React.FC<SimuladorCreditoProps> = ({ 
  usuarioId, 
  nombreUsuario, 
  conceptos,
  onClose, 
  onContactar 
}) => {
  const [activeTab, setActiveTab] = useState("informacion");
  const [entidadOfertada, setEntidadOfertada] = useState("");
  const [monto, setMonto] = useState("");
  const [ingreso, setIngreso] = useState("");
  const [salud, setSalud] = useState("0");
  const [carterasAComprar, setCarterasAComprar] = useState("");
  const [otrosDescuentos, setOtrosDescuentos] = useState("");
  const [resultadosCalculados, setResultadosCalculados] = useState<ResultadosCalculados | null>(null);
  const [respuestaSimulacion, setRespuestaSimulacion] = useState<{html: string} | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  const continuarHabilitado = entidadOfertada.trim() !== "" && monto.trim() !== "";
  
  const handleResultadosCalculados = (resultados: ResultadosCalculados) => {
    setResultadosCalculados(resultados);
  };

  // Crear ref para la sección de contacto
  const refContacto = useRef<HTMLDivElement>(null);

  // Handler para ir a la sección de contacto con scroll y focus
  const handleIrAContacto = () => {
    setActiveTab("contacto");
    setTimeout(() => {
      refContacto.current?.focus();
      refContacto.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  
  let idCliente = usuarioId;
  if (!idCliente) {
    idCliente = localStorage.getItem('idCliente');
  }
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
            <SimuladorInformacionInicial 
              entidadOfertada={entidadOfertada}
              monto={monto}
              conceptosEjemplo={conceptos}
              onEntidadOfertadaChange={setEntidadOfertada}
              onMontoChange={setMonto}
              onContinuar={() => setActiveTab("calculadora")}
              onClose={onClose}
              continuarHabilitado={continuarHabilitado}
            />
          </TabsContent>
          
          <TabsContent value="calculadora" className="mt-4">
            <SimuladorCalculadora 
              nombreUsuario={nombreUsuario}
              ingreso={ingreso}
              setIngreso={setIngreso}
              salud={salud}
              setSalud={setSalud}
              carterasAComprar={carterasAComprar}
              setCarterasAComprar={setCarterasAComprar}
              otrosDescuentos={otrosDescuentos}
              setOtrosDescuentos={setOtrosDescuentos}
              resultadosCalculados={resultadosCalculados}
              setResultadosCalculados={setResultadosCalculados}
              onResultadosCalculados={handleResultadosCalculados}
              onContactar={handleIrAContacto} 
            />
          </TabsContent>
          
          <TabsContent value="contacto" className="mt-4">
            <div ref={refContacto} tabIndex={-1}>
              {idCliente ? (
                <SimuladorContacto 
                  idCliente={idCliente}
                  nombreUsuario={nombreUsuario}
                  resultadosCalculados={resultadosCalculados}
                  onContactar={onContactar}
                />
              ) : (
                <div className="text-red-500 font-bold">❌ No hay ID de cliente disponible para contacto</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default SimuladorCredito;
