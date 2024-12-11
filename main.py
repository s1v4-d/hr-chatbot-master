from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apis.upload_api import router as upload_router
from apis.chat_api import router as chat_router
from apis.login_api import router as login_router

# Initialize FastAPI app
app = FastAPI(
    title="HR Chatbot API",
    description="An API for document embedding, conversational interactions, and user authentication.",
    version="1.0.0"
)

# Configure CORS Middleware
origins = [
    "http://localhost:3000",  # React app during development
    "https://your-production-domain.com"  # Frontend domain in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Domains allowed to make requests
    allow_credentials=True,  # Allow cookies and credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(login_router, prefix="/api")

@app.get("/", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "API is running"}
