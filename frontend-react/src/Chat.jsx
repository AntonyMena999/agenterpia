import { useState, useRef, useEffect } from "react";
import { useMsal, useAccount } from "@azure/msal-react";

export default function Chat() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  
  const [messages, setMessages] = useState([]); // Historial: [{role: 'user', text: '...'}, {role: 'bot', text: '...'}]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll al final cada vez que llega un mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleLogout = () => {
    instance.logoutRedirect({ account: account });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput(""); // Limpiar input
    setMessages(prev => [...prev, { role: "user", text: userText }]); // Agregar mensaje usuario
    setLoading(true);

    try {
      // 1. Obtener token silenciosamente
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: account
      });

      // 2. Llamar al backend
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenResponse.accessToken}`
        },
        body: JSON.stringify({ text: userText })
      });

      if (!res.ok) throw new Error("Error en la petición al backend");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.response }]);

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "Error: No pude conectar con el agente." }]);
    } finally {
      setLoading(false);
    }
  };

  // Permitir enviar con la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      {/* Header Superior */}
      <header className="chat-header">
        <div style={{ fontWeight: "bold" }}>Agente ERP</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.9em", color: "#666" }}>{account?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Salir</button>
        </div>
      </header>

      {/* Área de Mensajes */}
      <div className="messages-list">
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "50px", color: "#888" }}>
            <h2>¿En qué puedo ayudarte hoy?</h2>
            <p>Pregúntame sobre inventarios, ventas o datos del ERP.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="message-bubble bot">
            <em>Pensando...</em>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Área de Input (Abajo) */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta aquí..."
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
