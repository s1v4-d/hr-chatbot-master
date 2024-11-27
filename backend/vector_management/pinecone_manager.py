from pinecone import Pinecone, ServerlessSpec
from backend.config import Config

class PineconeManager:
    def __init__(self, api_key, index_name, dimension=Config.PINECONE_DIMENSION):
        """
        Initialize Pinecone client and index.

        Args:
            api_key (str): Pinecone API key.
            index_name (str): Name of the index to manage.
            dimension (int): Dimensionality of the vectors.
        """
        self.index_name = index_name
        self.dimension = dimension
        self.cloud = Config.PINECONE_CLOUD
        self.region = Config.PINECONE_ENVIRONMENT

        # Initialize Pinecone client
        self.client = Pinecone(api_key=api_key)

        # Create the index if it doesn't exist
        if self.index_name not in self.client.list_indexes().names():
            self.client.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",  # Metric can be adjusted if needed
                spec= ServerlessSpec(cloud=self.cloud, region=self.region)
            )

        # Connect to the index
        self.index = self.client.Index(self.index_name)

    def upsert_vectors(self, vectors):
        """
        Upsert vectors to the Pinecone index.

        Args:
            vectors (list): List of tuples in the format (id, vector, metadata).
        """
        self.index.upsert(vectors)

    def query_vectors(self, vector, top_k=5):
        """
        Query vectors in the Pinecone index.

        Args:
            vector (list): Query vector.
            top_k (int): Number of top results to retrieve.

        Returns:
            dict: Query results.
        """
        return self.index.query(vector=vector, top_k=top_k, include_metadata=True)
