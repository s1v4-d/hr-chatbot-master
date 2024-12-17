import os
from backend.config import Config
from groq import Groq

class LLMFactory:
    """Factory class to create instances of Large Language Models."""

    @staticmethod
    def call_llm(system_message, query):

        api_key = Config.GROQ_API_KEY
        if not api_key:
            raise ValueError("API key not found in Config.")

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
            messages=messages,
            temperature=Config.TEMPERATURE,
            max_tokens=Config.MAX_TOKENS,
            top_p=Config.TOP_P
        )
        chat_response_content = chat_response.choices[0].message.content
        return chat_response_content
