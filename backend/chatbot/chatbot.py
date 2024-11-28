# chatbot.py
from backend.chatbot.llm_factory import LLMFactory
from backend.vector_management.vector_search import VectorSearch

class HRChatbot:
    """Chatbot with hybrid search and minimum coverage."""

    def __init__(self, vector_search, llm_model_name=None, llm_api_key=None):
        """
        Initialize the chatbot with vector search and LLM configuration.

        Args:
            vector_search (VectorSearch): The vector search engine for context retrieval.
            llm_model_name (str): The name of the LLM model.
            llm_api_key (str): The API key for the LLM service.
        """
        self.vector_search = vector_search
        self.llm = LLMFactory.create_llm(model_name=llm_model_name, api_key=llm_api_key)

    async def generate_streaming_response(self, user_query):
        """
        Generate a streaming response using hybrid search with minimum coverage.

        Args:
            user_query (str): User's query.

        Yields:
            str: Tokens of the response.
        """
        # Perform hybrid search with minimum coverage
        search_results = self.vector_search.hybrid_search_with_min_coverage(
            query=user_query, top_k=10, coverage_threshold=0.7
        )

        # Build context from search results
        context = "\n".join([
            f"ID: {res['id']}\nSummary: {res['metadata']['chunk']}\nScore: {res['score']}"
            for res in search_results
        ])

        # Generate streaming response
        full_query = f"{context}\n\nUser Query: {user_query}"
        response_stream = self.llm.chat([{"role": "user", "content": full_query}])

        async for token in response_stream.response_gen:
            yield token
