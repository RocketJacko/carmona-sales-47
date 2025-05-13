import { Test } from './utils/Test';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const test = Test.getInstance();
  const logFile = path.join(__dirname, 'test-results.log');
  
  const usuario = 'Jruiz';
  const email = 'jruiz.pineda99@gmail.com';
  const clave = 'Medellin2025*';

  let log = '\n=== PRUEBA COMPLETA ===\n';
  log += `Fecha: ${new Date().toLocaleString()}\n`;
  log += `Usuario: ${usuario}\n`;
  log += `Email: ${email}\n`;
  log += `Clave: ${clave}\n\n`;

  // Paso 1: Validar email
  log += '1. VALIDACIÓN DE EMAIL\n';
  const emailValido = await test.validarEmail(email);
  log += `Resultado: ${emailValido ? '✅ Email autorizado' : '❌ Email no autorizado'}\n\n`;

  if (!emailValido) {
    log += '❌ No se puede continuar porque el email no está autorizado\n';
    fs.writeFileSync(logFile, log);
    return;
  }

  // Paso 2: Registrar usuario
  log += '2. REGISTRO DE USUARIO\n';
  const registroExitoso = await test.registrarUsuario(usuario, email, clave);
  log += `Resultado: ${registroExitoso ? '✅ Usuario registrado' : '❌ Error en el registro'}\n\n`;

  if (!registroExitoso) {
    log += '❌ No se puede continuar porque el registro falló\n';
    fs.writeFileSync(logFile, log);
    return;
  }

  // Paso 3: Login
  log += '3. INICIO DE SESIÓN\n';
  const loginExitoso = await test.loginUsuario(usuario, clave);
  log += `Resultado: ${loginExitoso ? '✅ Login exitoso' : '❌ Error en el login'}\n\n`;

  // Guardar resultados
  fs.writeFileSync(logFile, log);
  console.log('✅ Resultados guardados en:', logFile);
}

main().catch(error => {
  console.error('Error:', error);
  fs.writeFileSync(
    path.join(__dirname, 'test-results.log'),
    `\n❌ ERROR: ${error.message}\n`
  );
}); 