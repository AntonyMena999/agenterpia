let msalApp;

const req = { scopes: ["User.Read"] };

async function initAuth() {
  try {
    const res = await fetch("http://127.0.0.1:8000/config");
    const config = await res.json();

    msalApp = new msal.PublicClientApplication({
      auth: {
        clientId: config.clientId,
        authority: "https://login.microsoftonline.com/" + config.tenantId,
        redirectUri: window.location.origin
      }
    });

    // Es OBLIGATORIO manejar la promesa de redirección al cargar, incluso usando Popups.
    // Esto procesa el token si la página se recarga o si el popup devuelve el control.
    await msalApp.handleRedirectPromise();

    updateUI();
  } catch (error) {
    console.error("Error cargando configuracion:", error); 
  }
}

// Función para controlar el estado de la interfaz (bloquear/desbloquear chat)
function updateUI() {
  if (!msalApp) return;
  const account = msalApp.getAllAccounts()[0];
  const inputField = document.getElementById("q");
  
  if (inputField) {
    if (account) {
      // Usuario logueado: Habilitar chat
      inputField.disabled = false;
      inputField.placeholder = "Escribe tu pregunta sobre el ERP...";
    } else {
      // No logueado: Bloquear chat
      inputField.disabled = true;
      inputField.placeholder = "Inicia sesion para chatear";
    }
  }
}

function login() {
  // Cambiamos a loginRedirect para evitar el error de "Cross-Origin-Opener-Policy"
  // La interfaz se actualizará automáticamente cuando la página se recargue y se ejecute initAuth()
  msalApp.loginRedirect(req).catch(err => console.error("Error iniciando login:", err));
}

function logout() {
  // Especificamos la cuenta para asegurar que MSAL limpie el estado correcto
  const account = msalApp.getAllAccounts()[0];
  msalApp.logoutRedirect({
    account: account
  });
}

async function send() {
  const acc = msalApp.getAllAccounts()[0];

  if (!acc) {
    alert("Acceso denegado: Debes iniciar sesion con Microsoft Entra ID para enviar mensajes.");
    login(); // Opcional: Intentar abrir el login automáticamente
    return;
  }

  const token = await msalApp.acquireTokenSilent({
    ...req,
    account: acc
  });

  const q = document.getElementById("q").value;

  const res = await fetch("http://127.0.0.1:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token.accessToken
    },
    body: JSON.stringify({ text: q })
  });

  const data = await res.json();

  document.getElementById("r").innerText = data.response;
} 

// Ejecutar al cargar la página para verificar si ya existe una sesión activa
initAuth();
