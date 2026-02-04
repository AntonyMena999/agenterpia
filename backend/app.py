from fastapi import FastAPI, Header, HTTPException
from jose import jwt
from foundry_agent import ask_agent

app = FastAPI()

TENANT = "TU_TENANT_ID"

def verify_token(auth_header: str):

    if not auth_header:
        raise HTTPException(401)

    token = auth_header.split(" ")[1]

    decoded = jwt.get_unverified_claims(token)

    if decoded["tid"] != TENANT:
        raise HTTPException(401)

    return decoded


@app.post("/ask")
def ask(q: dict, authorization: str = Header(None)):

    verify_token(authorization)

    answer = ask_agent(q["text"])

    return {"response": answer}
