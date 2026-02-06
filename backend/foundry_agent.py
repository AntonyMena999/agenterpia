import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

# Variables globales para almacenar la conexión (Singleton)
_project = None
_agent = None

def get_agent_client():
    """Inicializa el cliente de Azure solo cuando se necesita."""
    global _project, _agent
    if _project is None:
        credential = DefaultAzureCredential()
        endpoint_url = os.environ["PROJECT_ENDPOINT"].strip()
        if not endpoint_url.startswith("https://") and not endpoint_url.startswith("http://"):
            endpoint_url = f"https://{endpoint_url}"
        
        _project = AIProjectClient(credential=credential, endpoint=endpoint_url)
        _agent = _project.agents.get_agent(os.environ["AGENT_ID"])
    return _project, _agent


def ask_agent(question: str):
    # Conectamos aquí, no al inicio del archivo
    project, agent = get_agent_client()

    thread = project.agents.threads.create()

    project.agents.messages.create(
        thread_id=thread.id,
        role="user",
        content=question
    )

    run = project.agents.runs.create_and_process(
        thread_id=thread.id,
        agent_id=agent.id
    )

    messages = project.agents.messages.list(thread_id=thread.id)

    return messages[-1].text_messages[-1].text.value
