import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'

// Función asíncrona para inicializar la app después de obtener la config del backend
async function init() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  try {
    // 1. Obtener configuración del backend (igual que hacías en script.js)
    const response = await fetch("http://127.0.0.1:8000/config");
    const config = await response.json();

    // 2. Configurar MSAL con los datos recibidos
    const msalInstance = new PublicClientApplication({
      auth: {
        clientId: config.clientId,
        authority: `https://login.microsoftonline.com/${config.tenantId}`,
        redirectUri: window.location.origin,
      },
      cache: {
        cacheLocation: "sessionStorage", // Guarda sesión si recargas la página
        storeAuthStateInCookie: false,
      }
    });

    // 3. Inicializar instancia (Requerido en versiones nuevas de MSAL)
    await msalInstance.initialize();
    
    // 4. Manejar respuesta de redirección (si venimos de un login)
    await msalInstance.handleRedirectPromise();

    // 5. Renderizar la App envolviéndola en el proveedor de MSAL
    root.render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );

  } catch (error) {
    console.error("Error inicializando la aplicación:", error);
    root.render(<h1>Error cargando la configuración. Asegúrate de que el backend esté corriendo.</h1>);
  }
}

init();
