from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.chatbot.chatbot import HRChatbot
from apis.auth_utils import decode_token

router = APIRouter()

# HTTP Bearer security
security = HTTPBearer()

# Initialize the HRChatbot instance
chatbot = HRChatbot()

class QueryRequest(BaseModel):
    query: str

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    token = creds.credentials
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return payload

@router.post("/chat", tags=["Chat"])
async def chat(request: QueryRequest, current_user: dict = Depends(get_current_user)):
    """
    Chat endpoint to generate a response for the user's query.
    Requires Bearer token authentication.
    """
    try:
        # Get response from the chatbot
        response = chatbot.talk_to_chatbot(request.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
