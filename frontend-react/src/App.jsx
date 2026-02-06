import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import Chat from "./Chat";

function App() {
  const { instance } = useMsal();

  const handleLogin = () => {
    // Usamos loginRedirect como corregimos anteriormente
    instance.loginRedirect({ scopes: ["User.Read"] }).catch(e => console.error(e));
  };

  return (
    <>
      {/* Se muestra solo si el usuario ESTÁ autenticado */}
      <AuthenticatedTemplate>
        <Chat />
      </AuthenticatedTemplate>

      {/* Se muestra solo si el usuario NO está autenticado */}
      <UnauthenticatedTemplate>
        <div className="login-container">
          <h1>Agente ERP IA</h1>
          <p>Bienvenido. Inicia sesión para consultar información del sistema.</p>
          <button className="login-btn" onClick={handleLogin}>
            Iniciar Sesión con Microsoft
          </button>
        </div>
      </UnauthenticatedTemplate>
    </>
  );
}

export default App;
