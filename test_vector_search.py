# main.py

from backend.augmentations.vector_search_with_filtering import VectorSearchWithFiltering
from backend.augmentations.multi_query_generator import MultiQueryGenerator  # assuming this is your multi-query generator
from backend.vector_management.pinecone_manager import PineconeManager  # assuming this is your Pinecone manager

def main():
    query = "What are the best practices for HR policies?"

    # Initialize PineconeManager (ensure it's initialized correctly)
    pinecone_manager = PineconeManager()
    
    # Initialize MultiQueryGenerator (ensure it's implemented correctly)
    multi_query_generator = MultiQueryGenerator()

    # Initialize the VectorSearchWithFiltering class
    search_with_filtering = VectorSearchWithFiltering(query, multi_query_generator, pinecone_manager)
    
    # Perform the search with filtering and reranking
    final_results = search_with_filtering.perform_search()
    
    # Output the final reranked results
    print("Final Results After Redundancy Filtering and Reranking:")
    for result in final_results:
        print(result)

if __name__ == "__main__":
    main()
