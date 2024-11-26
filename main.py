from fastapi import FastAPI
from apis.upload_api import router as upload_router
from apis.chat_api import router as chat_router
from apis.login_api import router as login_router

app = FastAPI(
    title="HR Chatbot API",
    description="An API for document embedding, conversational interactions, and user authentication.",
    version="1.0.0"
)

# Include routers
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(login_router, prefix="/api")

@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "API is running"}
