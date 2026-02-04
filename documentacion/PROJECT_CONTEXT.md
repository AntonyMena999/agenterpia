# Contexto del Proyecto: Agente Foundry

## Descripción General
Este proyecto es una aplicación web de tipo **Chat ERP IA**. Actúa como una interfaz de usuario para interactuar con un asistente inteligente, diseñado para consultar información de un sistema ERP utilizando tecnologías de **Microsoft Azure AI**.

## Arquitectura del Sistema
El sistema sigue una arquitectura Cliente-Servidor desacoplada:

1.  **Frontend (SPA)**:
    -   **Ubicación**: `/frontend`
    -   **Tecnologías**: HTML5, JavaScript (Vanilla), MSAL.js (Microsoft Authentication Library).
    -   **Función**: Autenticación de usuarios y chat interactivo.
    -   **Comunicación**: Realiza peticiones HTTP POST al backend.

2.  **Backend (API Python)**:
    -   **Ubicación**: Raíz del proyecto (entorno virtual en `/venv`).
    -   **Tecnologías**: Python 3.x, Azure AI SDKs (`azure-ai-projects`, `azure-ai-agents`), `azure-identity`.
    -   **Función**: Valida la identidad del usuario (Entra ID) y utiliza su propia identidad de servicio para consultar a Azure Foundry de forma segura.

## Flujo de Datos
1.  **Inicio de Sesión**: El usuario se autentica en el frontend con credenciales de Microsoft (Azure AD).
2.  **Token**: El frontend obtiene un `AccessToken` con el scope `User.Read`.
3.  **Consulta**: El usuario escribe una pregunta en el chat.
4.  **Procesamiento**:
    -   El frontend envía la pregunta y el token al endpoint `/ask`.
    -   El backend valida el token (seguridad).
    -   El backend utiliza `DefaultAzureCredential` (identidad del servidor) para invocar al Agente de Azure AI (Foundry).
5.  **Respuesta**: La IA genera una respuesta (posiblemente consultando datos o herramientas del ERP) y se devuelve al frontend para su visualización.