import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = 4000;

// Habilitar CORS para todas las rutas
app.use(cors());
app.use(express.json());

app.post('/api/simular-credito', async (req, res) => {
  const {
    EST_VDBLE,
    TNOMINAL,
    GSC_NUMID,
    GSC_MONTOSOL,
    TIPO_LINCLI,
    GSC_PLAZOSOL,
    TIP_CREDLIB
  } = req.body;

  // Validación básica
  if (!EST_VDBLE || !TNOMINAL || !GSC_NUMID || !GSC_MONTOSOL || !TIPO_LINCLI || !GSC_PLAZOSOL || !TIP_CREDLIB) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Armar la URL para la API externa
  const url = `https://activosyfinanzas.com.co/ixcrm/?CGLW_PROC=EJECUTA_OBJETO&OBJETO=modregional.simula_credlib&MARCASIM=2&DEBUG=2004&EST_VDBLE=${encodeURIComponent(EST_VDBLE)}&TNOMINAL=${encodeURIComponent(TNOMINAL)}&GSC_NUMID=${encodeURIComponent(GSC_NUMID)}&GSC_MONTOSOL=${encodeURIComponent(GSC_MONTOSOL)}&TIPO_LINCLI=${encodeURIComponent(TIPO_LINCLI)}&EST_MAXMONTO=%20%20%20%20%20%2027%2C679%2C552&GSC_PLAZOSOL=${encodeURIComponent(GSC_PLAZOSOL)}&LCREDVIG=&TIP_COMERCIAL=Vendor&TIP_CREDLIB=${encodeURIComponent(TIP_CREDLIB)}&IX_BROWSER=ns&IDSES=vproc&IXCAMPOACT=CALMONTO&IDSESSION=`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'es,en;q=0.9',
        'Authorization': 'Basic dmVuZG9yX2plc3VzY2FybW9uYToqKkphY2MwNTEyMjAwMyoq',
        'Connection': 'keep-alive',
        'Referer': 'https://activosyfinanzas.com.co/ixcrm/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta de Activos y Finanzas: ${response.status} - ${response.statusText}`);
    }

    const html = await response.text();
    res.status(200).json({ html });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud', mensaje: error.message });
  }
});

// Middleware para manejar errores no capturados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Proxy API escuchando en http://localhost:${PORT}`);
}); 