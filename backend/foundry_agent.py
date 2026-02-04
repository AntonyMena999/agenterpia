import os
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()

credential = DefaultAzureCredential()

# Obtener endpoint y asegurar que use HTTPS (requerido por Azure SDK)
endpoint_url = os.environ["PROJECT_ENDPOINT"].strip()
if not endpoint_url.startswith("https://") and not endpoint_url.startswith("http://"):
    endpoint_url = f"https://{endpoint_url}"

project = AIProjectClient(
    credential=credential,
    endpoint=endpoint_url
)

agent = project.agents.get_agent(os.environ["AGENT_ID"])



def ask_agent(question: str):

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
