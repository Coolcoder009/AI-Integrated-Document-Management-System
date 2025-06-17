# import requests
# from langchain_core.runnables import RunnableLambda
# import os
# from dotenv import load_dotenv
# from langchain_huggingface import HuggingFaceEndpoint
#
# load_dotenv()
# repo_id = "Qwen/Qwen2.5-Coder-32B-Instruct"
# llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.7,max_new_tokens=10)
# def create_chat_name(document_content: str, user_query: str) -> str:
#     prompt = (
#         "Based on the document content and user query below, generate a concise cool chat name that is 1-3 words long. "
#         "Please do not include any explanations, alternatives, special characters or additional responses. Just provide the chat name.\n\n"
#         f"Document Content: {document_content}\n"
#         f"User Query: {user_query}\n\n"
#         "Chat Name:"
#     )
#
#     result = llm(prompt )
#
#
#     if isinstance(result, dict) and 'llm_response' in result:
#         chat_name = result['llm_response'].strip()
#         chat_name = chat_name.split("Chat Name:")[-1].strip()
#         return chat_name
#     else:
#         print("Error in response:", result)
#         return "Error: Unable to generate chat name."

import os
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# -------------------------------
# 1. Chat Name Generation
# -------------------------------

def create_chat_name(document_content: str, user_query: str) -> str:
    prompt = (
        "Based on the document content and user query below, generate a concise, cool chat name that is 1–3 words long. "
        "Only return the chat name — no punctuation, no explanation.\n\n"
        f"Document Content: {document_content}\n"
        f"User Query: {user_query}\n\n"
        "Chat Name:"
    )

    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=10,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text.strip()