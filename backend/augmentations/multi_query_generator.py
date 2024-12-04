from backend.chatbot.llm_factory import LLMFactory

 
class MultiQueryGenerator:
    """Class to generate multiple query variations using an LLM."""
 
    def __init__(self, user_query, num_queries=2):
        """
        Initialize the MultiQueryGenerator with the user query.
 
        Args:
            user_query (str): The original query from the user.
            num_queries (int): Number of query variations to generate.
        """
        self.user_query = user_query
        self.num_queries = num_queries
 
    def generate_queries(self):
        """
        Generate multiple variations of the user query.
 
        Args:
            user_query (str): The original query from the user.
            num_queries (int): Number of query variations to generate.
 
        Returns:
            list: List of query variations.
        """
        prompt = (
            f"Generate {self.num_queries} different versions of the following query to improve information retrieval:\n"
        )
       
        # Split response into queries and append the original user query
        response=LLMFactory.call_llm(prompt, self.user_query)
        queries = response.split("\n")
        queries.append(self.user_query)  # Append the original query to the list
 
        return [query.strip() for query in queries if query.strip()]