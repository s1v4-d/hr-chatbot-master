import os
from backend.config import Config
from groq import Groq
 
class LLMFactory:
    """Factory class to create instances of Large Language Models."""
 
    @staticmethod
    def call_llm(system_message, query):
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
        groq_client = Groq(api_key=api_key)
        messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": query}
    ]
        model = Config.LLM_MODEL_NAME
        if not model:
            raise ValueError("Model name not found in Config.")

        chat_response = groq_client.chat.completions.create(
        model=model,
        messages=messages
    )
        chat_response_content = chat_response.choices[0].message.content
        return chat_response_content
 