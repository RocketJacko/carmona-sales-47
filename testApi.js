process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { JSDOM } from 'jsdom';

const url = `https://activosyfinanzas.com.co/ixcrm/?CGLW_PROC=EJECUTA_OBJETO&OBJETO=modregional.simula_credlib&MARCASIM=2&DEBUG=2004&EST_VDBLE=574000&TNOMINAL=1%2C9426&GSC_NUMID=27399946&GSC_MONTOSOL=1000000&TIPO_LINCLI=Linea%20Bancoomeva%20Oro&EST_MAXMONTO=%20%20%20%20%20%2027%2C679%2C552&GSC_PLAZOSOL=168&LCREDVIG=&TIP_COMERCIAL=Vendor&TIP_CREDLIB=Libre%20Inversion&IX_BROWSER=ns&IDSES=vproc&IXCAMPOACT=CALMONTO&IDSESSION=`;

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'es,en;q=0.9',
  'Authorization': 'Basic dmVuZG9yX2plc3VzY2FybW9uYToqKkphY2MwNTEyMjAwMyoq',
  'Connection': 'keep-alive',
  'Referer': 'https://activosyfinanzas.com.co/ixcrm/',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
};

async function consultarSimulador() {
  try {
    const res = await fetch(url, { method: 'GET', headers });
    const html = await res.text();
    
    // Crear un DOM usando jsdom
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    // Captura de valores de los campos del formulario
    const tipoCredito = doc.getElementById('TIP_CREDLIB')?.value || '';
    const estimacionMonto = doc.getElementById('EST_MAXMONTO')?.value || '';
    const tipoCliente = doc.getElementById('TIPO_LINCLI')?.value || '';
    const tasaNominal = doc.getElementById('TNOMINAL')?.value || '';
    const montoSolicitado = doc.getElementById('GSC_MONTOSOL')?.value || '';
    const plazoSolicitado = doc.getElementById('GSC_PLAZOSOL')?.value || '';
    const creditosVigentes = doc.getElementById('LCREDVIG')?.value || '';
    const totalCreditos = doc.getElementById('ixcntck_LCREDVIG')?.value || '';
    const numValores = doc.getElementById('LCREDVIG_numvals')?.value || '';

    // Mostrar en consola para verificar
    console.log('✅ Datos extraídos del formulario:', {
      tipoCredito,
      estimacionMonto,
      tipoCliente,
      tasaNominal,
      montoSolicitado,
      plazoSolicitado,
      creditosVigentes,
      totalCreditos,
      numValores
    });

  } catch (err) {
    console.error('❌ Error en la consulta:', err.message);
  }
}

consultarSimulador(); 