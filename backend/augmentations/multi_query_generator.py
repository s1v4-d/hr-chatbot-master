from llama_index.core.llms import ChatMessage
from llama_index.llms.groq import Groq
from backend.chatbot.llm_factory import LLMFactory
from backend.config import Config
 
class MultiQueryGenerator:
    """Class to generate multiple query variations using an LLM."""
 
    def __init__(self, model_name):
        # Only pass model_name to create the LLM client
        self.llm = LLMFactory.create_llm(model_name)
 
    def generate_queries(self, user_query, num_queries=2):
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
       
        # Split response into queries and append the original user query
        queries = response.split("\n")
        queries.append(user_query)  # Append the original query to the list
 
        return [query.strip() for query in queries if query.strip()]