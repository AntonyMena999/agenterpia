# Documentación Técnica: Frontend

## Estructura de Archivos
El frontend ha sido migrado a **React** utilizando **Vite** como empaquetador.

- **src/main.jsx**: Punto de entrada. Inicializa MSAL (Auth) y carga la configuración del backend antes de renderizar la App.
- **src/App.jsx**: Componente principal. Decide qué mostrar basado en el estado de autenticación:
  - Si **NO** está logueado: Muestra pantalla de bienvenida y botón de Login.
  - Si **SÍ** está logueado: Muestra el componente `Chat`.
- **src/Chat.jsx**: Lógica del chat. Maneja el estado de los mensajes, envío al backend y renderizado de burbujas de chat.
- **src/index.css**: Estilos globales y diseño de la interfaz (tipo Gemini/WhatsApp).

## Dependencias
Para instalar las dependencias en un entorno nuevo, ejecutar en la carpeta `frontend-react`:

```bash
npm install
```

Las librerías principales son:
- `react`, `react-dom`: Framework UI.
- `@azure/msal-browser`: Núcleo de autenticación.
- `@azure/msal-react`: Componentes y Hooks de React para MSAL.

## Ejecución
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```
Generalmente corre en `http://localhost:5173`.

## Configuración (`main.jsx`)
Al igual que la versión anterior, no almacena credenciales. Consume `/config` del backend al iniciar:
```javascript
async function init() {
  const res = await fetch("http://127.0.0.1:8000/config");
  const config = await res.json();
  // Inicializa PublicClientApplication con config.clientId
}
```

## Funciones Clave

### `handleLogin` (en `App.jsx`)
- Inicia el flujo de redirección (`loginRedirect`) para evitar bloqueos de ventanas emergentes.
- Solicita el permiso `User.Read` para leer el perfil básico del usuario.

### `handleSend` (en `Chat.jsx`)
1.  **Verificación**: Comprueba si el input no está vacío.
2.  **Obtención de Token**: Llama a `acquireTokenSilent` para obtener un JWT válido sin interrumpir al usuario.
3.  **Petición API**:
    -   **URL**: `http://127.0.0.1:8000/ask`
    -   **Método**: `POST`
    -   **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
4.  **Estado**: Actualiza el array `messages` para renderizar la nueva burbuja de chat con la respuesta.