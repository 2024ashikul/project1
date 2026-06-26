from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from langchain_core.messages import HumanMessage, AIMessage

from app.ml.rag import get_rag_chain

router = APIRouter()


class Message(BaseModel):
    role: str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    user_input: str
    chat_history: List[Message] = []
    ocr_text: str | None = None
    vision_symptoms: str | None = None


class ChatResponse(BaseModel):
    answer: str


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        rag_chain = get_rag_chain()

        # Build combined input (append OCR / vision context if present)
        combined_input = req.user_input
        if req.ocr_text:
            combined_input += f"\n\n[OCR থেকে পাওয়া তথ্য / Extracted from image]:\n{req.ocr_text}"
        if req.vision_symptoms:
            combined_input += f"\n\n[রোগীর আপলোড করা ছবির লক্ষণ]:\n{req.vision_symptoms}"

        # Convert serialised history to LangChain message objects
        lc_history = []
        for msg in req.chat_history:
            if msg.role == "user":
                lc_history.append(HumanMessage(content=msg.content))
            else:
                lc_history.append(AIMessage(content=msg.content))

        response = rag_chain.invoke({
            "input": combined_input,
            "chat_history": lc_history,
        })
        return ChatResponse(answer=response["answer"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
