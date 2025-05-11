import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
    const email = 'jruiz.pineda99@gmail.com';
    const password = '123456';

    console.log('=== INICIANDO SESIÓN ===');
    console.log('Email:', email);
    console.log('Clave:', password);

    try {
        // Intentar iniciar sesión
        console.log('Iniciando sesión...');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
            return { success: false, message: 'Error al iniciar sesión. Por favor verifica tus credenciales.' };
        } else {
            console.log('Sesión iniciada exitosamente:', data);
            return { success: true, message: '¡Sesión iniciada exitosamente!' };
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        return { success: false, message: 'Error inesperado al iniciar sesión.' };
    }
}

// Ejecutar la prueba
testLogin().then(result => {
    console.log('Resultado:', result.message);
}); 