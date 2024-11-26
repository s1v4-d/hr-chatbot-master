from backend.vector_management.pinecone_manager import PineconeManager
from backend.vector_management.bm25_retriever import BM25Retriever
from backend.vector_management.reranker import Reranker

class VectorSearch:
    """Hybrid search with minimum coverage and reranking."""

    def __init__(self, embedding_model_name, pinecone_api_key, pinecone_environment, pinecone_index_name, dimension=1024):
        self.bm25_retriever = BM25Retriever()
        self.pinecone_manager = PineconeManager(
            api_key=pinecone_api_key,
            environment=pinecone_environment,
            index_name=pinecone_index_name,
            dimension=dimension
        )
        self.reranker = Reranker()

    def hybrid_search_with_min_coverage(self, query, top_k=10, coverage_threshold=0.7):
        """
        Perform hybrid search ensuring minimum coverage of the index.

        Args:
            query (str): User query.
            top_k (int): Number of results to retrieve.
            coverage_threshold (float): Fraction of the index to cover.

        Returns:
            list: Ranked and deduplicated results.
        """
        # Perform semantic (vector) search
        query_embedding = self.pinecone_manager.embedder.generate_embedding(query)
        vector_results = self.pinecone_manager.query_vectors(query_embedding, top_k=top_k)

        # Perform keyword (BM25) search
        keyword_results = self.bm25_retriever.search(query, top_k=top_k)

        # Retrieve least accessed chunks for minimum coverage
        least_accessed_ids = self.pinecone_manager.get_least_accessed_chunks(threshold=coverage_threshold)
        coverage_results = [
            self.pinecone_manager.index_metadata[chunk_id]
            for chunk_id in least_accessed_ids
        ]

        # Combine all results
        all_results = vector_results + keyword_results + coverage_results

        # Deduplicate and re-rank using the Reranker
        return self.reranker.deduplicate_and_rank(all_results)
