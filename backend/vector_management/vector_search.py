from backend.embeddings.embedding_generator import EmbeddingGenerator
from backend.vector_management.pinecone_manager import PineconeManager
from backend.vector_management.bm25_retriever import BM25Retriever
from backend.vector_management.reranker import Reranker
from backend.config import Config

class VectorSearch:
    """Hybrid search with minimum coverage and reranking."""

    def __init__(self, embedding_model_name, pinecone_api_key, pinecone_index_name, dimension=1024):
        #print("Initializing VectorSearch...")

        # Initialize the embedding generator directly
        self.embedding_generator = EmbeddingGenerator(model_name=embedding_model_name)
        print("EmbeddingGenerator initialized.")
        
        # Initialize Pinecone Manager
        self.pinecone_manager = PineconeManager(
            api_key=pinecone_api_key,
            index_name=pinecone_index_name,
            dimension=dimension
        )
        print("PineconeManager initialized.")
        
        # Initialize BM25 retriever and Reranker
        # self.bm25_retriever = BM25Retriever()
        # print("BM25Retriever initialized.")
        
        # self.reranker = Reranker()
        # print("Reranker initialized.")
        #print("VectorSearch initialized successfully.")

    # def hybrid_search_with_min_coverage(self, query, top_k=3, coverage_threshold=0.7):
    #     """
    #     Perform hybrid search ensuring minimum coverage of the index.

    #     Args:
    #         query (str): User query.
    #         top_k (int): Number of results to retrieve.
    #         coverage_threshold (float): Fraction of the index to cover.

    #     Returns:
    #         list: Ranked and deduplicated results.
    #     """
    #     print(f"Starting hybrid search for query: '{query}'")

    #     # Generate query embedding using the embedding generator
    #     print("Generating query embedding...")
    #     query_embedding = self.embedding_generator.generate_embedding(query)
    #     print("Query embedding generated.")

    #     # Perform vector search
    #     print(f"Performing vector search with top_k={top_k}...")
    #     vector_results = self.pinecone_manager.query_vectors(query_embedding, top_k=top_k)
    #     print(f"Vector search returned {len(vector_results.get('matches', []))} results.")

    #     # Perform keyword (BM25) search
        # print("Performing BM25 keyword search...")
        # keyword_results = self.bm25_retriever.search(query, top_k=top_k)
        # print(f"BM25 search returned {len(keyword_results)} results.")

        # Retrieve least accessed chunks for minimum coverage
        # print(f"Retrieving least accessed chunks with coverage threshold={coverage_threshold}...")
        # least_accessed_ids = self.pinecone_manager.get_least_accessed_chunks(threshold=coverage_threshold)
        # coverage_results = [
        #     self.pinecone_manager.index_metadata[chunk_id]
        #     for chunk_id in least_accessed_ids
        # ]
        # print(f"Retrieved {len(coverage_results)} coverage results.")

        # Combine all results
        # print("Combining results...")
        # all_results = vector_results + coverage_results

        # Deduplicate and re-rank using the Reranker
        # print("Deduplicating and re-ranking results...")
        # ranked_results = self.reranker.deduplicate_and_rank(all_results)
        # print(f"Hybrid search completed. Returning {len(ranked_results)} ranked results.")

        # return ranked_results
        # return all_results
        # return vector_results

    def search_vector_db(self, query, top_k=3):
        query_embedding = self.embedding_generator.generate_embedding(query)
        # print("Query embedding generated.")

        # # Perform vector search
        # print(f"Performing vector search with top_k={top_k}...")
        vector_search_results = self.pinecone_manager.query_vectors(query_embedding, top_k=top_k)
        return vector_search_results