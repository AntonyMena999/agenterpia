# Documentación Técnica: Frontend

## Estructura de Archivos
- **index.html**: Interfaz de usuario minimalista. Contiene:
  - Botones de autenticación (`Login`, `Logout`).
  - Área de entrada de texto (`#q`) y botón de envío.
  - Área de respuesta (`#r`).
- **script.js**: Lógica de la aplicación cliente.

## Dependencias
- **MSAL Browser**: `https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js`
  - Librería oficial de Microsoft para autenticación SPA (Single Page Application).

## Configuración (`script.js`)
El frontend no almacena credenciales fijas. Al cargar, consume el endpoint `/config` del backend para obtener los IDs necesarios:
```javascript
async function initAuth() {
  const res = await fetch("http://127.0.0.1:8000/config");
  const config = await res.json();
  // Inicializa MSAL con config.clientId y config.tenantId
}
```

## Funciones Clave

### `login()`
- Inicia el flujo de "Login Popup".
- Solicita el permiso `User.Read` para leer el perfil básico del usuario.

### `send()`
1.  **Verificación**: Comprueba si hay una cuenta activa (`getAllAccounts`).
2.  **Obtención de Token**: Llama a `acquireTokenSilent` para obtener un JWT válido sin interrumpir al usuario.
3.  **Petición API**:
    -   **URL**: `http://127.0.0.1:8000/ask`
    -   **Método**: `POST`
    -   **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
4.  **Renderizado**: Muestra la respuesta JSON del backend en el elemento `<p id="r">`.