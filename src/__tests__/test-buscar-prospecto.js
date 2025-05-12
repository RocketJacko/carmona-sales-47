import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProcesoCompleto() {
    console.log('\n=== INICIANDO PROCESO COMPLETO ===');
    try {
        // 1. Autenticar al usuario
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'jruiz.pineda99@gmail.com',
            password: '123456'
        });

        if (authError) {
            console.error('Error de autenticacion:', authError.message);
            return;
        }

        console.log('Usuario autenticado correctamente');
        console.log('Credenciales del usuario:', {
            email: authData.user.email,
            username: authData.user.user_metadata.username,
            id: authData.user.id
        });

        // 2. Buscar un cliente disponible
        console.log('\n=== BUSCANDO CLIENTE DISPONIBLE ===');
        const { data: clienteData, error: clienteError } = await supabase.rpc('buscarcliente');
        
        if (clienteError) {
            console.error('Error al buscar cliente:', clienteError.message);
            return;
        }

        if (!clienteData || clienteData.length === 0) {
            console.log('No se encontraron clientes disponibles');
            return;
        }

        const cliente = clienteData[0];
        console.log('Cliente encontrado:', cliente);

        // 3. Actualizar el ejecutivo asignado
        console.log('\n=== ACTUALIZANDO EJECUTIVO ASIGNADO ===');
        const { data: updateData, error: updateError } = await supabase.rpc('update_ejecutivo_asignado', {
            p_username: authData.user.user_metadata.username,
            p_comprobante_nomina: cliente["COMPROBANTE DE NOMINA No."]
        });

        if (updateError) {
            console.error('Error al actualizar ejecutivo:', updateError.message);
            return;
        }

        console.log('Proceso completado exitosamente');
        console.log('Cliente asignado:', {
            idCliente: cliente.idcliente,
            comprobante: cliente["COMPROBANTE DE NOMINA No."],
            nombres: cliente["Nombres docente"],
            apellidos: cliente["Apellidos docente"],
            ejecutivoAsignado: authData.user.user_metadata.username
        });

    } catch (error) {
        console.error('\nError inesperado:', error);
    }
}

testProcesoCompleto(); 