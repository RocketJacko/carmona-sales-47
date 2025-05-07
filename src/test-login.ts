import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  
  const usuario = 'davidP';
  const clave = 'Medellin2025*';

  console.log('\n=== INICIANDO SESIÓN ===');
  console.log('Usuario:', usuario);
  console.log('Clave:', clave);

  const resultado = await test.loginUsuario(usuario, clave);
  console.log('\nResultado:', resultado ? '✅ Login exitoso' : '❌ Error en el login');
}

main().catch(console.error); 