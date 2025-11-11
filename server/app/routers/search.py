from fastapi import APIRouter
from app.schemas.search_schema import SearchRequest
from app.services.ai_service import get_ai_suggestions

router = APIRouter(prefix="/search", tags=["Search"])

@router.post("/memory")
def search_memory(request: SearchRequest):
    """
    Receives a text query, sends it to Gemini, and returns AI suggestions.
    """
    suggestions = get_ai_suggestions(request.query)
    return {"query": request.query, "suggestions": suggestions}
