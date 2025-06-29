import getpass
import os
from dotenv import load_dotenv
load_dotenv()

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

from langchain.chat_models import init_chat_model

model = init_chat_model("gemini-2.0-flash", model_provider="google_genai")
data=model.invoke("Hello, how are you?")
# Example of using context with Gemini model
def process_with_context(context, query):
 
    prompt = f"""
    Context: {context}
    
    Query: {query}
    
    Please provide a detailed response based on the context provided.
    """
    response = model.invoke(prompt)
    return response.content
