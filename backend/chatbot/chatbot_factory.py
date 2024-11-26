from backend.chatbot.chatbot import HRChatbot
from backend.vector_management.vector_search import VectorSearch
from backend.config import Config

def get_chatbot():
    """
    Factory function to create and configure an HRChatbot instance.

    Returns:
        HRChatbot: Configured HRChatbot instance.
    """
    # Initialize VectorSearch with required configurations
    vector_search = VectorSearch(
        embedding_model_name=Config.EMBEDDING_MODEL_NAME,
        pinecone_api_key=Config.PINECONE_API_KEY,
        pinecone_index_name=Config.PINECONE_INDEX_NAME
    )

    # Create an HRChatbot instance
    chatbot = HRChatbot(
        vector_search=vector_search,
        llm_model_name=Config.LLM_MODEL_NAME,
        llm_api_key=Config.GROQ_API_KEY
    )
    
    return chatbot
