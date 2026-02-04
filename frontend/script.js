const msalApp = new msal.PublicClientApplication({
  auth: {
    clientId: "TU_CLIENT_ID",
    authority: "https://login.microsoftonline.com/TU_TENANT_ID",
    redirectUri: window.location.origin
  }
});

const req = { scopes: ["User.Read"] };

function login() {
  msalApp.loginPopup(req);
}

function logout() {
  msalApp.logout();
}

async function send() {

  const acc = msalApp.getAllAccounts()[0];

  if (!acc) {
    alert("Login primero");
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
