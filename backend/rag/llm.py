from langchain.chains import RetrievalQA

import os
from anthropic import Anthropic
from dotenv import load_dotenv
from rag.embeddings import embeddings
from rag.qdrant_utils import client

load_dotenv()

from langchain_huggingface import HuggingFaceEndpoint
from langchain_qdrant import Qdrant

# Initialize the LLM
repo_id = "Qwen/Qwen2.5-Coder-32B-Instruct"

client_anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.7,max_new_tokens=10)
# Function to query the LLM using the chat's collection
def query_llm(chat_name, query_text):
    # Step 1: Get relevant documents from Qdrant
    vector_store = Qdrant(client=client, collection_name=chat_name, embeddings=embeddings)
    retriever = vector_store.as_retriever()
    docs = retriever.get_relevant_documents(query_text)

    if not docs:
        return "Your query does not match the context!"

    # Step 2: Extract context text
    context_text = "\n\n".join(doc.page_content for doc in docs)

    # Step 3: Claude call using messages API
    response = client_anthropic.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        temperature=0,
        system=(
            "You are a knowledgeable assistant. Only answer using the given context. "
            "If the question is unrelated or the context doesn't help, respond with: "
            "'Your query does not match the context!'"
        ),
        messages=[
            {
                "role": "user",
                "content": f"Context:\n{context_text}\n\nQuestion: {query_text}"
            }
        ]
    )

    return {"result": response.content[0].text.strip()}


def classify_document_content(document_text):
    try:
        prompt = (
            "Classify this document into one of the following categories: "
            "Bill, Insurance, Invoice, Tax Document, Medical Report. "
            "Respond only with the exact category label, and do not add any punctuation or new categories. "
            "Here is the document content:\n\n"
            f"{document_text}\n\n"
            "Category:"
        )

        result = llm.invoke(prompt)
        return result.strip()
    except Exception as e:
        print(f"LLM classification error: {e}")
        return None
