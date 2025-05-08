import { Test } from './utils/Test';

async function testValidarEmail() {
  const test = Test.getInstance();
  const email = 'davidpt94@gmail.com';
  return await test.validarEmail(email);
}

// Ejecutar la prueba
testValidarEmail()
  .then(resultado => {
    console.log(resultado); // true o false
  })
  .catch(error => {
    console.error('Error:', error);
  }); 