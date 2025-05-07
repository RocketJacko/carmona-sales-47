import { Test } from './utils/Test.js';

async function testConexion() {
    const test = Test.getInstance();
    const resultado = await test.verificarConexion();
    console.log('Resultado de la verificación:');
    console.log(JSON.stringify(resultado, null, 2));
}

testConexion().catch(console.error); 