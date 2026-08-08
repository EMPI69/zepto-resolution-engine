from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.engine import ResolutionEngine


app = FastAPI(
    title="Zepto Resolution Engine",
    description="Evidence-based customer support resolution API",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
      )

engine = ResolutionEngine()


class ResolveRequest(BaseModel):
    ticket_id: str


@app.get("/")
def root():
    return {
        "service": "Zepto Resolution Engine",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.get("/api/tickets")
def get_tickets():
    try:
        tickets = engine.new_tickets[
            ["ticket_id", "description", "order_id"]
        ].to_dict(orient="records")

        return {
            "total": len(tickets),
            "tickets": tickets
        }

    except Exception as e:
        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/api/tickets/resolve")
def resolve_ticket(request: ResolveRequest):
    try:
        result = engine.resolve_ticket(request.ticket_id)
        return result

    except Exception as e:
        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )