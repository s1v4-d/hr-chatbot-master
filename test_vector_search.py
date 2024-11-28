from backend.vector_management.vector_search import VectorSearch
from backend.config import Config

def test_vector_search():
    """
    Test the VectorSearch functionality with a sample query.
    """
    print("Testing VectorSearch functionality...")

    # Initialize VectorSearch
    vector_search = VectorSearch(
        embedding_model_name=Config.EMBEDDING_MODEL_NAME,
        pinecone_api_key=Config.PINECONE_API_KEY,
        pinecone_index_name=Config.PINECONE_INDEX_NAME
    )

    # Define a sample query
    sample_query = "What are the best practices for HR policies?"

    # Perform hybrid search
    try:
        print(f"Performing hybrid search for query: '{sample_query}'")
        results = vector_search.hybrid_search_with_min_coverage(query=sample_query)
        print("Search results:")
        for i, result in enumerate(results, start=1):
            print(f"Result {i}: {result}")
    except Exception as e:
        print(f"Error during hybrid search: {e}")

if __name__ == "__main__":
    test_vector_search()
