import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  const email = 'prueba5@pascualbravo.edu.co';
  const resultado = await test.validarEmail(email);
  console.log('Email:', email);
  console.log('Resultado exacto:', resultado);
  console.log(`SELECT validacion_email('${email}') = ${resultado}`);
}

main().catch(console.error); 