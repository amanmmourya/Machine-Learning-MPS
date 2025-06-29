import pdfplumber
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import joblib
import numpy as np
import os
def pdf_to_text(path, output_file):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    with open(output_file, "w", encoding="utf-8") as f:
        f.write(text)


def documentLoader(path):
    loader=TextLoader(path,encoding="utf-8")
    return loader.load()

def chunking(data):
    splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
    chunks=splitter.split_documents(data)
    return chunks
    
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embeddings(texts):
    embeddings = embedding_model.encode(texts)
    return np.array(embeddings).astype("float32")

def create_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)  # L2 distance (Euclidean)
    index.add(embeddings) # type: ignore
    return index

def search_similar_documents(index, query_text, documents, top_k=2):
    query_embedding = generate_embeddings([query_text])
    distances, indices = index.search(query_embedding, top_k)
    results = [documents[i] for i in indices[0]]
    return results

def mainFunction(query):
    embeddings,chunk_texts=joblib.load(os.path.join(os.path.dirname(__file__), "embedding_data.joblib"))
    print("embeddings generated")
    index = faiss.read_index(os.path.join(os.path.dirname(__file__), "faiss_index.bin"))
    print("index loaded")
    results = search_similar_documents(index, query, chunk_texts)
    final_results=[]
    for doc in results:
        final_results.append(doc)
    print(final_results)
    return final_results