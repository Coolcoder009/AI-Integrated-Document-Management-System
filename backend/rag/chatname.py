

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