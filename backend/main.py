from fastapi import FastAPI

app = FastAPI(
    title="Otari AI",
    description="Mozilla Otari Cost-Aware AI Assistant",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Otari AI Backend Running Successfully!"
    }