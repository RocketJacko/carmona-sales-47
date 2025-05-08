import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistro() {
    const email = 'jruiz.pineda99@gmail.com';
    const password = '123456';
    const username = 'usuarioPrueba5';

    console.log('=== REGISTRANDO USUARIO ===');
    console.log('Email:', email);
    console.log('Clave:', password);
    console.log('Usuario:', username);

    try {
        // Verificar si el correo está autorizado
        console.log('Verificando correo autorizado...');
        const { data: authorizedEmail, error: authError } = await supabase
            .from('correos_autorizados')
            .select('email')
            .eq('email', email)
            .single();

        if (authError) {
            console.error('Error al verificar correos autorizados:', authError.message);
            return;
        }

        if (!authorizedEmail) {
            console.error('El correo no está autorizado');
            return;
        }

        console.log('Correo autorizado encontrado');

        // Registrar al usuario
        console.log('Registrando usuario...');
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            console.error('Error al registrar:', error.message);
        } else {
            console.log('Usuario registrado exitosamente:', data);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
    }
}

// Ejecutar la prueba
testRegistro(); 