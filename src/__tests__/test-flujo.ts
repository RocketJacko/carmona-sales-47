import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  
  const email = 'jruiz.pineda99@gmail.com';
  const usuario = 'Jruiz';
  const clave = 'Medellin2025*';

  await test.probarFlujoCompleto(email, usuario, clave);
}

main().catch(console.error); 