# backend/augmentations/reranker.py

from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel
import torch

class Reranker:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('bge-rerank-base')
        self.model = AutoModel.from_pretrained('bge-rerank-base')

    def encode(self, text):
        # Tokenize and encode the input text
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.pooler_output.squeeze().numpy()

    def rerank(self, query, documents):
        query_embedding = self.encode(query)
        doc_embeddings = [self.encode(doc) for doc in documents]
        
        # Compute cosine similarity between the query and the documents
        similarities = [cosine_similarity([query_embedding], [doc_embedding])[0][0] for doc_embedding in doc_embeddings]
        
        # Rank documents based on similarity to query
        ranked_docs = [doc for _, doc in sorted(zip(similarities, documents), reverse=True)]
        
        return ranked_docs
