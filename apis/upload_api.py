from fastapi import APIRouter, UploadFile, HTTPException, BackgroundTasks
from backend.augmentations.document_processor import DocumentProcessor
from backend.embeddings.embedding_generator import EmbeddingGenerator
from backend.vector_management.pinecone_manager import PineconeManager
from backend.config import Config
import os
import time

router = APIRouter()

# Initialize components
document_processor = DocumentProcessor(chunk_size=1000, chunk_overlap=100)
embedding_generator = EmbeddingGenerator(model_name=Config.EMBEDDING_MODEL_NAME)
pinecone_manager = PineconeManager(
    api_key=Config.PINECONE_API_KEY,
    index_name=Config.PINECONE_INDEX_NAME
)

@router.post("/upload", tags=["Upload"])
async def upload_document(file: UploadFile, background_tasks: BackgroundTasks):
    start_time = time.time()
    print(f"Received upload request at {start_time}")

    # Validate file type
    if file.content_type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a DOCX file.")

    try:
        temp_file_path = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)

        # Save file to disk
        with open(temp_file_path, "wb") as f:
            while chunk := await file.read(1024):  # Stream file in 1KB chunks
                f.write(chunk)

        print(f"File saved: {temp_file_path}")

        # Schedule processing in the background
        background_tasks.add_task(process_document, temp_file_path, file.filename)
        end_time = time.time()
        print(f"File scheduled for processing. Time taken: {end_time - start_time} seconds")

        return {"status": "Accepted", "message": "File is being processed"}

    except Exception as e:
        print(f"Error during upload: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {e}")


async def process_document(temp_file_path, filename):
    """
    Background task to process the document and index chunks.
    """
    try:
        chunks = document_processor.process_docx(temp_file_path)
        for idx, chunk in enumerate(chunks):
            vector_id = f"{filename}_{idx}"
            embedding = embedding_generator.generate_embedding(chunk)
            pinecone_manager.upsert_vectors([(vector_id, embedding, {"chunk": chunk})])
        os.remove(temp_file_path)
        print("Document processing completed.")
    except Exception as e:
        print(f"Error during document processing: {e}")
