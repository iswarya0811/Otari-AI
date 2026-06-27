from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Otari AI Backend Running Successfully!"
    }