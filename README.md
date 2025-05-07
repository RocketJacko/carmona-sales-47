# Carmona Sales CRM

Sistema CRM para gestión de ventas y clientes.

## Características

- Autenticación de usuarios
- Validación de correos electrónicos
- Registro de usuarios
- Gestión de clientes
- Seguimiento de contactos

## Requisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd carmona-sales-47
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes React
  ├── services/      # Servicios (Supabase, etc.)
  ├── utils/         # Utilidades y helpers
  ├── models/        # Interfaces y tipos
  ├── views/         # Vistas principales
  └── test/          # Archivos de prueba
```

## Funcionalidades Implementadas

- ✅ Validación de correo electrónico
- ✅ Registro de usuarios
- ✅ Login de usuarios
- ✅ Gestión de sesión
- ✅ Interfaz de usuario moderna

## Pruebas

Para ejecutar las pruebas de las funcionalidades principales:

```bash
# Prueba de validación de email
tsx src/test-email.ts

# Prueba de registro
tsx src/test-registro.ts

# Prueba de login
tsx src/test-login.ts
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

// Punto de restauración generado el 07/05/2025
