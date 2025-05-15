const express = require('express');
const https = require('https');
const { URL } = require('url');
const app = express();
app.use(express.json());

app.post('/api/simular-credito', (req, res) => {
  const parametros = req.body;
  console.log('[BACKEND] Parámetros recibidos:', parametros);

  const base = 'https://activosyfinanzas.com.co/ixcrm/';
  const query = new URLSearchParams({
    CGLW_PROC: 'EJECUTA_OBJETO',
    OBJETO: 'modregional.simula_credlib',
    MARCASIM: '2',
    DEBUG: '2004',
    EST_VDBLE: parametros.EST_VDBLE,
    TNOMINAL: parametros.TNOMINAL,
    GSC_NUMID: parametros.GSC_NUMID,
    GSC_MONTOSOL: parametros.GSC_MONTOSOL,
    TIPO_LINCLI: parametros.TIPO_LINCLI,
    EST_MAXMONTO: parametros.EST_MAXMONTO,
    GSC_PLAZOSOL: parametros.GSC_PLAZOSOL,
    LCREDVIG: '',
    TIP_COMERCIAL: parametros.TIP_COMERCIAL,
    TIP_CREDLIB: parametros.TIP_CREDLIB,
    IX_BROWSER: 'ns',
    IDSES: 'vproc',
    IXCAMPOACT: 'CALMONTO',
    IDSESSION: ''
  });

  const fullUrl = new URL(base + '?' + query.toString());

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es,en;q=0.9',
      'Authorization': 'Basic dmVuZG9yX2plc3VzY2FybW9uYToqKkphY2MwNTEyMjAwMyoq',
      'Referer': 'https://activosyfinanzas.com.co/ixcrm/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    }
  };

  const reqApi = https.request(fullUrl, options, apiRes => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      console.log('[BACKEND] Respuesta de la API externa:', data);
      res.send(data);
    });
  });

  reqApi.on('error', err => {
    console.error('Error llamando a API:', err);
    res.status(500).json({ error: 'Fallo la API' });
  });

  reqApi.end();
});

app.listen(4000, () => console.log('Backend escuchando en puerto 4000')); 