import os
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Importamos la lógica del agente desde foundry_agent.py
try:
    from foundry_agent import ask_agent
except ImportError:
    from .foundry_agent import ask_agent

app = FastAPI(title="Chat ERP IA")

# Configuración de CORS para permitir que el frontend (index.html) se comunique con el backend
app.add_middleware(
    CORSMiddleware,
    # En producción, reemplaza ["*"] con la URL de tu frontend "Angular", ej: ["http://localhost:5500", "https://mi-app.azurewebsites.net"]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    text: str

@app.post("/ask")
async def ask_endpoint(question: Question, authorization: Optional[str] = Header(None)):
    print(f"--> Solicitud recibida del Frontend: {question.text}")
    # 1. Validación básica de seguridad (Token de Entra ID)
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autorización faltante o inválido")
    
    # Validación de contenido vacío para no consumir recursos de IA innecesariamente
    if not question.text.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía")

    # 2. Procesamiento con el Agente de Azure Foundry
    try:
        response_text = ask_agent(question.text)
        return {"response": response_text}
    except Exception as e:
        print(f"Error en el agente: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/config")
async def get_config():
    client_id = os.getenv("AZURE_CLIENT_ID")
    tenant_id = os.getenv("AZURE_TENANT_ID")

    if not client_id or not tenant_id:
        print("⚠️  ADVERTENCIA: Faltan credenciales en .env (AZURE_CLIENT_ID). El login del frontend no funcionará.")

    return {
        "clientId": client_id,
        "tenantId": tenant_id
    }

@app.get("/")
async def root():
    return {"status": "online", "service": "Chat ERP IA Backend"}
