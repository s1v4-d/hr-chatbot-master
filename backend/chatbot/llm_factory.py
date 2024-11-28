# llm_factory.py
from backend.config import Config
from groq import Groq

class LLMFactory:
    """Factory class to create instances of Large Language Models."""

    @staticmethod
    def create_llm(model_name=None, api_key=None):
        """
        Create an instance of the specified LLM.

        Args:
            model_name (str): The name of the LLM model.
            api_key (str): The API key for the LLM service.

        Returns:
            An instance of the specified LLM.
        """
        model_name = model_name or Config.LLM_MODEL_NAME
        api_key = api_key or Config.GROQ_API_KEY

        # Initialize the Groq client with the provided model and API key
        return Groq(model=model_name, api_key=api_key)
