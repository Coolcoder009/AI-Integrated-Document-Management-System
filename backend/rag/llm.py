from langchain.chains import RetrievalQA
from rag.embeddings import embeddings
from rag.qdrant_utils import client
from langchain_huggingface import HuggingFaceEndpoint
from langchain_qdrant import Qdrant

# Initialize the LLM
repo_id = "Qwen/Qwen2.5-Coder-32B-Instruct"


llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.7,max_new_tokens=10)
# Function to query the LLM using the chat's collection
def query_llm(chat_name, query_text):
    vector_store = Qdrant(client=client, collection_name=chat_name, embeddings=embeddings)

    # Define a custom prompt
    strict_prompt = (
        "You are a knowledgeable assistant. Your responses should only be based on "
        "the content available in the vector store. If the query does not relate "
        "to the available content or you do not find relevant information, respond with 'Your query does not match the context!'. "
        "Do not use any external information that is not from the vector store.\n"
    )

    # Prepend the strict prompt to the user's query
    full_query = strict_prompt + query_text

    # Create the RetrievalQA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever()
    )

    response = qa_chain.invoke(full_query)
    
    return response

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