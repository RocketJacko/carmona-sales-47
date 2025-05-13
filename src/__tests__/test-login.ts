import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
    const email = 'jruiz.pineda99@gmail.com';
    const password = '123456';

    console.log('\n=== INICIANDO SESIÓN ===');
    console.log('Email:', email);
    console.log('Clave:', password);

    try {
        // Intentar iniciar sesión
        console.log('\nIniciando sesión...');
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
        } else {
            console.log('\n=== SESIÓN INICIADA EXITOSAMENTE ===');
            
            // Datos del usuario
            console.log('\n1. DATOS DEL USUARIO:');
            console.log('------------------------');
            console.log('ID:', data.user.id);
            console.log('Email:', data.user.email);
            console.log('Username:', data.user.user_metadata?.username);
            console.log('Último inicio de sesión:', data.user.last_sign_in_at);
            console.log('Fecha de creación:', data.user.created_at);
            
            // Datos de la sesión
            console.log('\n2. DATOS DE LA SESIÓN:');
            console.log('------------------------');
            console.log('Token de acceso:', data.session?.access_token);
            console.log('Token de actualización:', data.session?.refresh_token);
            console.log('Expira en:', new Date(data.session?.expires_at || 0).toLocaleString());
            
            // Datos que se guardarían en localStorage
            console.log('\n3. DATOS GUARDADOS EN LOCALSTORAGE:');
            console.log('------------------------');
            const userData = {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username
            };
            console.log('isAuthenticated:', 'true');
            console.log('userData:', JSON.stringify(userData, null, 2));
        }
    } catch (error) {
        console.error('\nError inesperado:', error);
    }
}

// Ejecutar la prueba
testLogin(); 