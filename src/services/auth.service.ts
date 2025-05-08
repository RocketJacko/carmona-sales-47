import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const authService = {
    async register(email: string, password: string, username: string): Promise<AuthResponse> {
        try {
            // Verificar si el correo está autorizado
            const { data: authorizedEmail, error: authError } = await supabase
                .from('correos_autorizados')
                .select('email')
                .eq('email', email)
                .single();

            if (authError) {
                return {
                    success: false,
                    message: 'Error al verificar correos autorizados'
                };
            }

            if (!authorizedEmail) {
                return {
                    success: false,
                    message: 'El correo no está autorizado'
                };
            }

            // Registrar al usuario
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            });

            if (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Error inesperado'
            };
        }
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            return {
                success: true,
                message: 'Sesión iniciada exitosamente',
                data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Error inesperado'
            };
        }
    },

    async logout(): Promise<AuthResponse> {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Error inesperado'
            };
        }
    }
}; 