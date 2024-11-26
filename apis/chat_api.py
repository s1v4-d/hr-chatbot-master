from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.chatbot.chatbot_factory import get_chatbot
import asyncio

router = APIRouter()

chatbot = get_chatbot()

class QueryRequest(BaseModel):
    query: str

@router.post("/chat", tags=["Chat"])
async def chat(request: QueryRequest):
    """
    Chat endpoint to generate a streaming response for the user's query.

    Args:
        request (QueryRequest): User query.

    Returns:
        StreamingResponse: Streaming response from the chatbot.
    """
    try:
        async def response_generator():
            async for token in chatbot.generate_streaming_response(request.query):
                yield token
                await asyncio.sleep(0.01)  # Simulates streaming

        return StreamingResponse(response_generator(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
