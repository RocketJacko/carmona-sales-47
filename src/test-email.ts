import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  
  const email = 'davidpt94@gmail.com';
  console.log('\n=== VALIDANDO EMAIL ===');
  console.log('Email a validar:', email);

  const resultado = await test.validarEmail(email);
  console.log('\nResultado:', resultado ? '✅ Email autorizado' : '❌ Email no autorizado');
}

main().catch(console.error); 