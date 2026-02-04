import os
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Importamos la lógica del agente desde foundry_agent.py
try:
    from foundry_agent import ask_agent
except ImportError:
    from .foundry_agent import ask_agent

load_dotenv()

app = FastAPI(title="Chat ERP IA")

# Configuración de CORS para permitir que el frontend (index.html) se comunique con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (ajustar en producción)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    text: str

@app.post("/ask")
async def ask_endpoint(question: Question, authorization: Optional[str] = Header(None)):
    # 1. Validación básica de seguridad (Token de Entra ID)
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autorización faltante o inválido")
    
    # 2. Procesamiento con el Agente de Azure Foundry
    try:
        response_text = ask_agent(question.text)
        return {"response": response_text}
    except Exception as e:
        print(f"Error en el agente: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "online", "service": "Chat ERP IA Backend"}
