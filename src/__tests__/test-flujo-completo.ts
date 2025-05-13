import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  
  // Datos de prueba
  const email = 'prueba6@pascualbravo.edu.co';
  const usuario = 'prueba6';
  const clave = '123456';

  console.log('Iniciando prueba de flujo completo...');
  await test.probarFlujoCompleto(email, usuario, clave);
}

main(); 