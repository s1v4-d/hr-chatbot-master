# main.py

from backend.vector_management.vector_search import VectorSearch
from backend.augmentations.multi_query_generator import MultiQueryGenerator  # assuming this is your multi-query generator
from backend.vector_management.pinecone_manager import PineconeManager  # assuming this is your Pinecone manager
from backend.config import Config

def main():
    # Initialize VectorSearch
    vector_search = VectorSearch(
        embedding_model_name=Config.EMBEDDING_MODEL_NAME,
        pinecone_api_key=Config.PINECONE_API_KEY,   # assuming this is your Pinecone API key    
        pinecone_index_name=Config.PINECONE_INDEX_NAME,
    )

    # Initialize MultiQueryGenerator
    generator = MultiQueryGenerator("What are the best practices for HR policies?", 2)
    queries = generator.generate_queries()
    #print(queries)
    retrievals = []
    for query in queries:
        # Perform hybrid search with minimum coverage
        results = vector_search.search_vector_db(query, top_k=3)
        #print(results)
        retrievals.append(results)
    print(f"Total results: {len(retrievals)}")
    print(retrievals[0])
    
    scores = []
    for retrieval in retrievals:
        scores.append(retrieval["metadata"]["score"])

    print(scores)


if __name__ == "__main__":
    main()
