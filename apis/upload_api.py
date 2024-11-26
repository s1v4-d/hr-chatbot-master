from fastapi import APIRouter, UploadFile, HTTPException
from backend.augmentations.document_processor import DocumentProcessor
from backend.embeddings.embedding_generator import EmbeddingGenerator
from backend.vector_management.pinecone_manager import PineconeManager
from backend.vector_management.bm25_retriever import BM25Retriever
from backend.config import Config
import os

router = APIRouter()

# Initialize necessary components
document_processor = DocumentProcessor(chunk_size=1000, chunk_overlap=100)
embedding_generator = EmbeddingGenerator(model_name=Config.EMBEDDING_MODEL_NAME)
pinecone_manager = PineconeManager(
    api_key=Config.PINECONE_API_KEY,
    index_name=Config.PINECONE_INDEX_NAME
)
bm25_retriever = BM25Retriever()

@router.post("/upload", tags=["Upload"])
async def upload_document(file: UploadFile):
    """
    Endpoint to upload a document, process it, generate embeddings, and store in Pinecone and Elasticsearch.

    Args:
        file (UploadFile): A DOCX file to be processed.

    Returns:
        dict: Status message.
    """
    if file.content_type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a DOCX file.")

    try:
        # Save and process the file
        temp_file_path = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())

        chunks = document_processor.process_docx(temp_file_path)

        # Index chunks into Pinecone and Elasticsearch
        for idx, chunk in enumerate(chunks):
            vector_id = f"{file.filename}_{idx}"
            embedding = embedding_generator.generate_embedding(chunk)

            # Upsert into Pinecone
            pinecone_manager.upsert_vectors([(vector_id, embedding, {"chunk": chunk})])

            # Index into Elasticsearch
            bm25_retriever.index_document(vector_id, chunk)

        # Clean up temporary file
        os.remove(temp_file_path)

        return {"status": "success", "message": f"{len(chunks)} chunks processed and indexed."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
