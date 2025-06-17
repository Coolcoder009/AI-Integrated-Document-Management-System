# import os
#
# from langchain_huggingface import HuggingFaceEndpoint
#
#
# # Initialize the LLM
# HF_TOKEN = os.getenv("HF_TOKEN")
# repo_id = "Qwen/Qwen2.5-Coder-32B-Instruct"
# llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.2, max_new_tokens=5, huggingfacehub_api_token=HF_TOKEN)
#
# # Define valid categories
# VALID_CATEGORIES = [
#     "Medical", "Insurance", "Finance", "Utility", "Legal", "Hotel", "Retail", "Others"
# ]
#
# def clean_and_validate_response(response_text):
#     """
#     Cleans and validates the LLM response.
#     If the response does not match a valid category, classify it as 'Others'.
#     """
#     if not response_text:
#         return "Others"  # Default to 'Others' for empty or invalid responses.
#
#     # Clean and normalize the response
#     cleaned_response = response_text.strip().split(".")[0].strip()  # Take only the first part if extra text is present.
#
#     # Check if the cleaned response matches a valid category
#     for category in VALID_CATEGORIES:
#         if cleaned_response.lower() == category.lower():
#             return category
#
#     # Fallback: classify unrecognized responses as 'Others'
#     return "Others"
#
# # Function to classify document content
# def classify_document_content(document_text):
#     try:
#         # Define strict classification prompt
#         prompt = (
#             "You are a document classifier. Your task is to classify the given document "
#             "into one of the following predefined categories: Medical, Insurance, Finance, "
#             "Utility, Legal, Hotel, Retail, Others. These are the only valid categories. "
#             "If the document does not clearly match any of these categories, classify it as 'Others'. "
#             "Respond **only** with the exact category name and nothing else.\n\n"
#             "Here is the document content:\n\n"
#             f"{document_text}\n\n"
#             "Category:"
#         )
#
#         # Invoke the LLM with the prompt
#         result = llm.invoke(prompt)
#
#
#         # Clean and validate the response
#         return clean_and_validate_response(result)
#
#     except Exception as e:
#         print(f"LLM classification error: {e}")
#         return "Error: Classification failed."

import os
from dotenv import load_dotenv
from anthropic import Anthropic

# Load environment variables
load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

VALID_CATEGORIES = [
    "Medical", "Insurance", "Finance", "Utility", "Legal", "Hotel", "Retail", "Others"
]

def clean_and_validate_response(response_text: str) -> str:
    if not response_text:
        return "Others"
    cleaned = response_text.strip().split(".")[0].strip()
    for category in VALID_CATEGORIES:
        if cleaned.lower() == category.lower():
            return category
    return "Others"

def classify_document_content(document_text: str) -> str:
    prompt = (
        "You are a document classifier. Classify the following document into one of these exact categories: "
        "Medical, Insurance, Finance, Utility, Legal, Hotel, Retail, Others. "
        "Respond ONLY with the category name. No extra text, punctuation, or explanation.\n\n"
        f"{document_text}\n\n"
        "Category:"
    )

    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=10,
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}]
    )

    return clean_and_validate_response(response.content[0].text)

