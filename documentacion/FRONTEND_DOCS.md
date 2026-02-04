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
Se requiere configurar el objeto `msalConfig` con los valores de tu Azure Tenant:
```javascript
const msalApp = new msal.PublicClientApplication({
  auth: {
    clientId: "TU_CLIENT_ID", // ID de la aplicación registrada en Azure
    authority: "https://login.microsoftonline.com/TU_TENANT_ID", // ID del inquilino
    redirectUri: window.location.origin // URL base (ej. http://localhost:3000)
  }
});
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