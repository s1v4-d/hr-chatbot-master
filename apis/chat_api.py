from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.chatbot.chatbot import HRChatbot

router = APIRouter()

# Initialize the HRChatbot instance
chatbot = HRChatbot()

class QueryRequest(BaseModel):
    query: str

@router.post("/chat", tags=["Chat"])
async def chat(request: QueryRequest):
    """
    Chat endpoint to generate a response for the user's query.
    """
    try:
        # Get response from the chatbot
        response = chatbot.talk_to_chatbot(request.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
