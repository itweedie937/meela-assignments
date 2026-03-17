from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import uuid
import json


# set up
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect("meela.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS form_submissions (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP        
        )
    """)
    conn.commit()
    conn.close()

init_db()


class SubmissionPayload(BaseModel):
    formData: dict = {}
    currentStep: int = 0

# endpoints
@app.post("/submissions")
def create_submission():
    conn = get_db()
    id = str(uuid.uuid4())
    conn.execute("INSERT INTO form_submissions (id, data) VALUES (?, ?)", (id, json.dumps({}),)
    )
    conn.commit()
    conn.close()
    print(f"created {id}")
    return {"id": id}


@app.get("/submissions/{submission_id}")
def get_submission(submission_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM form_submissions WHERE id = ?", (submission_id,)).fetchone()
    conn.close()

    if row is None:
        return {"error": "Not found"}
    return {"id": row["id"], "data": json.loads(row["data"])}


@app.put("/submissions/{submission_id}")
def update_submission(payload: SubmissionPayload, submission_id: str):
    conn = get_db()
    conn.execute("UPDATE form_submissions SET data = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?", (json.dumps(payload.model_dump()), submission_id,))
    conn.commit()
    conn.close()
    print(f"Saved {submission_id}")
    return {"ok": True}