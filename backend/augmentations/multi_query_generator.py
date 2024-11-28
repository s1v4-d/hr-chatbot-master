from llama_index.core.llms import ChatMessage
from llama_index.llms.groq import Groq
from backend.chatbot.llm_factory import LLMFactory

class MultiQueryGenerator:
    """Class to generate multiple query variations using an LLM."""

    def __init__(self, model_name, api_key):
        self.llm = LLMFactory.create_llm(model_name, api_key)

    def generate_queries(self, user_query, num_queries=5):
        """
        Generate multiple variations of the user query.

        Args:
            user_query (str): The original query from the user.
            num_queries (int): Number of query variations to generate.

        Returns:
            list: List of query variations.
        """
        prompt = (
            f"Generate {num_queries} different versions of the following query to improve information retrieval:\n"
            f"Query: {user_query}"
        )
        messages = [ChatMessage(role="user", content=prompt)]
        response = self.llm.chat(messages)
        queries = response.split("\n")
        return [query.strip() for query in queries if query.strip()]
