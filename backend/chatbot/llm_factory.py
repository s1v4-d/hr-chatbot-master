import os
from backend.config import Config
from groq import Groq
 
class LLMFactory:
    """Factory class to create instances of Large Language Models."""
 
    @staticmethod
    def create_llm(model_name):
        """
        Create an instance of the specified LLM.
 
        Args:
            model_name (str): The name of the LLM model.
 
        Returns:
            The LLM client for further interactions.
        """
        # Ensure the API key is loaded correctly from the environment
        api_key = Config.GROQ_API_KEY
        if not api_key:
            raise ValueError("API key not found in Config.")
       
        # Initialize the Groq client with the provided API key
        client = Groq(api_key=api_key)
 
        return client