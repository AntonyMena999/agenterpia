# Contexto del Proyecto: Agente Foundry

## Descripción General
Este proyecto es una aplicación web de tipo **Chat ERP IA**. Actúa como una interfaz de usuario para interactuar con un asistente inteligente, diseñado para consultar información de un sistema ERP utilizando tecnologías de **Microsoft Azure AI**.

## Arquitectura del Sistema
El sistema sigue una arquitectura Cliente-Servidor desacoplada:

1.  **Frontend (SPA)**:
    -   **Ubicación**: `/frontend-react`
    -   **Tecnologías**: React, Vite, MSAL React (@azure/msal-react).
    -   **Función**: Autenticación de usuarios y chat interactivo.
    -   **Comunicación**: Realiza peticiones HTTP POST al backend.

2.  **Backend (API Python)**:
    -   **Ubicación**: Raíz del proyecto (entorno virtual en `/venv`).
    -   **Tecnologías**: Python 3.x, FastAPI, Pydantic, Azure AI SDKs (`azure-ai-projects`, `azure-ai-agents`), `azure-identity`.
    -   **Función**: Provee configuración al frontend, valida tokens de usuario y utiliza su propia identidad (Service Principal o Developer) para consultar a Azure Foundry.

## Flujo de Datos
1.  **Inicialización**: El frontend solicita la configuración (`clientId`, `tenantId`) al backend (`GET /config`).
2.  **Inicio de Sesión**: El usuario se autentica en el frontend con credenciales de Microsoft (Azure AD).
3.  **Token**: El frontend obtiene un `AccessToken` con el scope `User.Read`.
4.  **Consulta**: El usuario escribe una pregunta en el chat (solo si está logueado).
5.  **Procesamiento**:
    -   El frontend envía la pregunta y el token al endpoint `/ask`.
    -   El backend valida el token (seguridad).
    -   El backend utiliza `DefaultAzureCredential` para invocar al Agente de Azure AI (Foundry).
6.  **Respuesta**: La IA genera una respuesta y se devuelve al frontend para su visualización.