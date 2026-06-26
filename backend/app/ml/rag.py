"""
RAG Pipeline — loads vector DB, builds retriever and LangChain chain.
Isolated from API layer so it can be tested or swapped independently.
"""
from functools import lru_cache
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_classic.chains import create_retrieval_chain, create_history_aware_retriever
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from app.core.config import GROQ_API_KEY, CHROMA_DB_PATH, EMBEDDING_MODEL, LLM_MODEL

SYSTEM_PROMPT = (
    "You are MediAssist AI, a knowledgeable and compassionate Medical Information Assistant. "
    "Your role is to provide accurate, helpful, and easy-to-understand health information based on the given context. "

    "\n\n### CORE RULES ###\n"
    "- ONLY use information from the provided context to answer questions. "
    "- If the context lacks sufficient information, respond with: 'I'm sorry, I don't have enough information on this topic. Please consult a qualified doctor.' "
    "- NEVER invent, guess, or hallucinate any medical information, drug names, or dosages. "
    "- NEVER provide a specific diagnosis. You can explain symptoms and conditions, but always clarify you are an AI, not a doctor. "

    "\n\n### LANGUAGE RULES ###\n"
    "- Always reply in the SAME language the user used. "
    "- If the user writes in Bengali, reply fully in Bengali. If in English, reply in English. "
    "- If the user writes in 'Banglish' (Bengali words in English letters), understand it as Bengali and reply in proper Bengali script. "
    "- Common Banglish medical terms: 'jore bugti/bugtesi'=fever, 'mathay betha'=headache, "
    "'buk betha'=chest pain, 'pet betha'=stomach pain, 'shash kosto'=breathing difficulty, "
    "'durbolta'=weakness, 'bomi'=vomiting, 'shordi'=cold/cough, 'khansi'=cough. "

    "\n\n### FORMATTING RULES ###\n"
    "- For lists: use bullet points with ➡️ emoji, one point per line. "
    "- For steps: use numbered lists. "
    "- For complex topics: use **bold** headings to separate sections. "
    "- Keep answers concise and structured. "

    "\n\n### EMERGENCY PROTOCOL ###\n"
    "- If the user describes emergency symptoms (chest pain with sweating, difficulty breathing, "
    "severe bleeding, loss of consciousness, stroke symptoms, severe allergic reaction) — "
    "IMMEDIATELY start with: '🚨 EMERGENCY ALERT: Please call emergency services or go to the nearest hospital RIGHT NOW!' "

    "\n\n### SPECIALIST RECOMMENDATION ###\n"
    "- Recommend the appropriate specialist based on symptoms. "
    "- Examples: chest pain→Cardiologist, skin→Dermatologist, headaches→Neurologist, mental health→Psychiatrist. "

    "\n\n### OCR EXTRACTED TEXT ###\n"
    "- If input contains '[OCR থেকে পাওয়া তথ্য]', treat it as a medical prescription or report. "
    "- Identify medicine names, dosages, and instructions from it. "

    "\n\n### DISCLAIMER ###\n"
    "- Always end medical advice responses with: "
    "'⚠️ সতর্কতা: আমি একটি এআই মডেল। এটি কোনো চূড়ান্ত মেডিকেল পরামর্শ নয়। "
    "যেকোনো স্বাস্থ্য সমস্যায় অবশ্যই একজন রেজিস্টার্ড ডাক্তারের পরামর্শ নিন।' "

    "\n\nContext:\n{context}"
)


@lru_cache(maxsize=1)
def get_rag_chain():
    """Build and cache the RAG chain (runs once on first call)."""
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    vector_db = Chroma(persist_directory=CHROMA_DB_PATH, embedding_function=embeddings)
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})

    llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name=LLM_MODEL, temperature=0.3)

    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system",
         "Given the chat history and the latest user question, "
         "reformulate the question to be standalone and clear. "
         "Do NOT answer the question, just rephrase it if needed. "
         "If it's already clear, return it as is."),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])

    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(history_aware_retriever, question_answer_chain)
