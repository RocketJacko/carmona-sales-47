import { Test } from './utils/Test';

async function main() {
  const test = Test.getInstance();
  
  const usuario = 'davidP';
  const email = 'davidpt94@gmail.com';
  const clave = 'Medellin2025*';

  console.log('\n=== REGISTRANDO USUARIO ===');
  console.log('Usuario:', usuario);
  console.log('Email:', email);
  console.log('Clave:', clave);

  const resultado = await test.registrarUsuario(usuario, email, clave);
  console.log('\nResultado:', resultado ? '✅ Usuario registrado' : '❌ Error en el registro');
}

main().catch(console.error); 