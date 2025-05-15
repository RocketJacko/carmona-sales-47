import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/config/supabase';
import { ConsumoApsi } from '@/services/consumoApsi';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ResultadosCalculados {
  capacidadLibreInversion: number;
  capacidadCompraCartera: number;
  fullCapacidad: number;
}

interface SimuladorContactoProps {
  idCliente: string | number | null;
  nombreUsuario?: string;
  resultadosCalculados: ResultadosCalculados | null;
  onContactar: () => void;
}

const actualizarProspectoFidu = async (
  idCliente: string | number,
  capacidadLibreInversion: number,
  capacidadCompraCartera: number,
  fullCapacidad: number
) => {
  console.log('🔗 Conectando a Supabase para actualizar prospectoFidu:', {
    idCliente,
    capacidadLibreInversion,
    capacidadCompraCartera,
    fullCapacidad
  });

  const { data, error } = await supabase
    .from('prospectoFidu')
    .update({
      capacidad_libre_inversion: capacidadLibreInversion,
      capacidad_compra_cartera: capacidadCompraCartera,
      full_capacidad: fullCapacidad
    })
    .eq('IdCliente', idCliente);

  if (error) {
    console.error('❌ Error al actualizar el prospecto:', error.message, { idCliente });
  } else {
    console.log('✅ Prospecto actualizado correctamente:', data, { idCliente });
  }
};

const SimuladorContacto: React.FC<SimuladorContactoProps> = ({ 
  idCliente,
  resultadosCalculados,
  nombreUsuario, 
  onContactar
}) => {
  // Formateador de moneda colombiana
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Recuperar idCliente de localStorage si no viene por props
  let clienteId = idCliente;
  if (!clienteId) {
    clienteId = localStorage.getItem('idCliente');
  }

  if (!resultadosCalculados) {
    return null;
  }

  const [entidadSeleccionada, setEntidadSeleccionada] = useState('Activos y Finanzas');
  const [tipoCredito, setTipoCredito] = useState("");
  const [tipoLinea, setTipoLinea] = useState("");
  const [tasaNominal, setTasaNominal] = useState("");
  const [respuestaSimulacion, setRespuestaSimulacion] = useState<{html: string} | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleIniciarContacto = async () => {
    if (!clienteId) {
      console.error('❌ Error: No hay ID de cliente disponible en handleIniciarContacto', clienteId);
      return;
    }
    await actualizarProspectoFidu(
      clienteId,
      resultadosCalculados.capacidadLibreInversion,
      resultadosCalculados.capacidadCompraCartera,
      resultadosCalculados.fullCapacidad
    );
    onContactar(); // Continuar con el flujo normal
  };

  return (
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
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona entidad</label>
          <select
            className="w-full p-3 text-base rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
            value={entidadSeleccionada}
            onChange={e => setEntidadSeleccionada(e.target.value)}
          >
            <option value="Kala">Kala</option>
            <option value="Activos y Finanzas">Activos y Finanzas</option>
            <option value="Avistta">Avistta</option>
          </select>
        </div>

        {entidadSeleccionada === 'Activos y Finanzas' && (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const GSC_NUMID = form.GSC_NUMID.value;
              const EST_VDBLE = form.EST_VDBLE.value;
              const TIP_CREDLIB = form.TIP_CREDLIB.value;
              const TIPO_LINCLI = form.TIPO_LINCLI.value;
              const TNOMINAL = form.TNOMINAL.value;
              const GSC_MONTOSOL = form.GSC_MONTOSOL.value;
              const GSC_PLAZOSOL = form.GSC_PLAZOSOL ? form.GSC_PLAZOSOL.value : '';
              const payload = {
                GSC_NUMID,
                EST_VDBLE,
                TIP_CREDLIB,
                TIPO_LINCLI,
                TNOMINAL,
                GSC_MONTOSOL,
                GSC_PLAZOSOL
              };
              const endpoint = 'https://TU_BACKEND_REAL.COM/api/simular-credito';
              console.log('JSON capturado para enviar:', payload);
              console.log('Se enviaría al backend:', endpoint);
            }}
          >
            <div>
              <label htmlFor="GSC_NUMID" className="block text-sm font-medium text-gray-700 mb-1">Número de Documento (GSC_NUMID)</label>
              <input type="number" id="GSC_NUMID" name="GSC_NUMID" required className="w-full p-3 rounded-md border border-gray-300 bg-white" />
            </div>
            <div>
              <label htmlFor="EST_VDBLE" className="block text-sm font-medium text-gray-700 mb-1">Disponible (EST_VDBLE)</label>
              <input type="number" id="EST_VDBLE" name="EST_VDBLE" required className="w-full p-3 rounded-md border border-gray-300 bg-white" />
            </div>
            <div>
              <label htmlFor="TIP_CREDLIB" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Crédito (TIP_CREDLIB)</label>
              <select
                id="TIP_CREDLIB"
                name="TIP_CREDLIB"
                className="w-full p-3 rounded-md border border-gray-300 bg-white"
                value={tipoCredito}
                onChange={e => {
                  const value = e.target.value;
                  setTipoCredito(value);
                  if (value === "Compra%20Cartera") {
                    setTipoLinea("Linea%20Bancoomeva%20Diamante");
                    setTasaNominal("1%2C7000");
                  } else if (value === "Libre%20Inversion") {
                    setTipoLinea("Linea%20Bancoomeva%20Oro");
                    setTasaNominal("1%2C9426");
                  } else {
                    setTipoLinea("");
                    setTasaNominal("");
                  }
                }}
              >
                <option value="">Seleccione...</option>
                <option value="Libre%20Inversion">Libre Inversión</option>
                <option value="Compra%20Cartera">Compra Cartera</option>
              </select>
            </div>
            <div>
              <label htmlFor="TIPO_LINCLI" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Línea (TIPO_LINCLI)</label>
              <select
                id="TIPO_LINCLI"
                name="TIPO_LINCLI"
                className="w-full p-3 rounded-md border border-gray-300 bg-white"
                value={tipoLinea}
                onChange={e => setTipoLinea(e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="Linea%20Bancoomeva%20Oro">Linea Bancoomeva Oro</option>
                <option value="Linea%20Bancoomeva%20Diamante">Linea Bancoomeva Diamante</option>
              </select>
            </div>
            <div>
              <label htmlFor="TNOMINAL" className="block text-sm font-medium text-gray-700 mb-1">Tasa Nominal (TNOMINAL)</label>
              <select
                id="TNOMINAL"
                name="TNOMINAL"
                className="w-full p-3 rounded-md border border-gray-300 bg-white"
                value={tasaNominal}
                onChange={e => setTasaNominal(e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="1%2C9426">1.9426</option>
                <option value="1%2C7000">1.7000</option>
              </select>
            </div>
            <div>
              <label htmlFor="GSC_MONTOSOL" className="block text-sm font-medium text-gray-700 mb-1">Monto Solicitado (GSC_MONTOSOL)</label>
              <input type="number" id="GSC_MONTOSOL" name="GSC_MONTOSOL" min="1000000" required className="w-full p-3 rounded-md border border-gray-300 bg-white" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800 h-10 px-4 py-2 mt-2">Enviar Simulación</button>
            </div>
          </form>
        )}

        <div>
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium">Simulación completada exitosamente</p>
              <p className="text-gray-500 mt-2">
                Ahora puede proceder al contacto del cliente
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleIniciarContacto} 
              className="bg-[#E6D2AA] hover:bg-[#D4B483] text-gray-800"
            >
              Iniciar Contacto <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogTitle>Respuesta de Simulación</DialogTitle>
          <div className="max-h-[60vh] overflow-auto">
            {respuestaSimulacion?.html && (
              <div dangerouslySetInnerHTML={{ __html: respuestaSimulacion.html }} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimuladorContacto;
