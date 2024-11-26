from backend.parsers.docx_parser import DocxParser
from llama_index.core.node_parser import SentenceSplitter


class DocumentProcessor:
    """Class to process documents and split them into chunks."""

    def __init__(self, chunk_size=1000, chunk_overlap=10):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.splitter = SentenceSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    def process_docx(self, file_path):
        """
        Process a DOCX file and split its content into chunks.

        Args:
            file_path (str): Path to the DOCX file.

        Returns:
            list: List of text chunks.
        """
        text = DocxParser.extract_text(file_path)
        return self.split_text(text)

    def split_text(self, text):
        """
        Split text into chunks.

        Args:
            text (str): Text to be split.

        Returns:
            list: List of text chunks.
        """
        return self.splitter.split_text(text)
