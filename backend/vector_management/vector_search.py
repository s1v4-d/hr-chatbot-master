from backend.embeddings.embedding_generator import EmbeddingGenerator
from backend.vector_management.pinecone_manager import PineconeManager
from backend.augmentations.multi_query_generator import MultiQueryGenerator 
from backend.config import Config

class VectorSearch:
    """Hybrid search with minimum coverage and reranking."""

    def __init__(self, embedding_model_name, pinecone_api_key, pinecone_index_name, dimension=1024):

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
        
        
    def search_vector_db(self, query, top_k=3):
        query_embedding = self.embedding_generator.generate_embedding(query)
        vector_search_results = self.pinecone_manager.query_vectors(query_embedding, top_k=top_k)
        return vector_search_results
    
    
    def search_vector_db_with_multi_query(self, query, top_k=3):
        generator = MultiQueryGenerator(query, 2)
        queries = generator.generate_queries()
        retrievals = []
        for query in queries:
            results = self.search_vector_db(query, top_k=top_k)
            retrievals.append(results)
        scored_chunks=[]
        for retrieval in retrievals:
            for match in retrieval['matches']:
                scored_chunks.append({
                    'chunk': match['metadata']['chunk'],
                    'score': match['score']
                })
        return scored_chunks