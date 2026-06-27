from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.smallest_service import smallest_client, SmallestAPIException
from services.prompt_router import prompt_router


app = FastAPI(
    title="Otari AI",
    description="Mozilla Otari Cost-Aware AI Assistant",
    version="1.0.0"
)

# Enable CORS for frontend development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify ["http://localhost:5174", "http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Otari AI Backend Running Successfully!"
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )
        
    try:
        reply = await smallest_client.chat_completion(request.message)
        return {"reply": reply}
    except SmallestAPIException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@app.post("/analyze")
def analyze_prompt(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )
    return prompt_router.classify_prompt(request.message)