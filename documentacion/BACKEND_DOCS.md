# Documentación Técnica: Backend

## Descripción
El backend actúa como el orquestador entre la interfaz de chat y los servicios de **Azure AI Foundry**. Está construido en Python y expone una API REST para procesar las consultas del ERP.

## Stack Tecnológico
- **Lenguaje**: Python 3.x
- **Framework API**: FastAPI o Flask (ejecutándose en `http://127.0.0.1:8000`).
- **Validación**: `pydantic` para esquemas de datos.
- **IA & Agentes**:
  - `azure-ai-projects`: SDK para gestión de proyectos AI Foundry.
  - `azure-ai-agents`: SDK para creación y ejecución de agentes inteligentes.
  - `openai`: Cliente estándar para modelos GPT.
- **Seguridad**:
  - `azure-identity`: Manejo de identidad del servicio (Service Principal / Managed Identity) para conectar con Foundry.

## Endpoints

### `POST /ask`
Endpoint principal que recibe las preguntas del usuario.

- **URL**: `http://127.0.0.1:8000/ask`
- **Headers**:
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer <access_token>` (Token JWT de Microsoft Entra ID enviado por el frontend).
- **Body**:
  ```json
  {
    "text": "Pregunta del usuario sobre el ERP..."
  }
  ```
- **Respuesta Exitosa (200 OK)**:
  ```json
  {
    "response": "Respuesta generada por el agente..."
  }
  ```

## Configuración del Entorno
El backend utiliza `DefaultAzureCredential`, lo que permite autenticarse localmente mediante **Azure CLI** (`az login`) sin necesidad de gestionar secretos manualmente.

### Variables Requeridas (`.env`)
- `PROJECT_ENDPOINT`: Endpoint del proyecto Azure AI Foundry (URL que comienza con https://...).
- `AGENT_ID`: ID del agente configurado en Foundry que orquestará la respuesta.

*Nota: `AZURE_TENANT_ID` y `AZURE_SUBSCRIPTION_ID` se detectan automáticamente con `az login`, pero pueden definirse explícitamente si es necesario.*