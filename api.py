from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.email_agent import analyze_email
from agents.decision_agent import decide_action
from agents.task_agent import handle_task
from agents.crm_agent import handle_crm

app = FastAPI()

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    email: str

@app.post("/process-email")
def process_email(request: EmailRequest):
    analysis = analyze_email(request.email)
    decision = decide_action(analysis)

    result = {
        "analysis": analysis,
        "action": decision
    }

    if decision == "task":
        result["task"] = handle_task(request.email, analysis.get("priority"))

    elif decision == "crm":
        result["lead"] = handle_crm(request.email)

    return result