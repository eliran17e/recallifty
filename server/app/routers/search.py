from fastapi import APIRouter
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor
from app.services.ai_service import get_ai_suggestions
from app.services.youtube_service import search_youtube
import time

router = APIRouter(prefix="/search", tags=["Search"])

class SearchRequest(BaseModel):
    query: str

@router.post("/memory")
async def search_memory(request: SearchRequest):
    total_start = time.time()
    
    # Get AI suggestions
    ai_start = time.time()
    suggestions = get_ai_suggestions(request.query)
    ai_elapsed = time.time() - ai_start
    print(f"⏱️  Gemini API took: {ai_elapsed:.2f} seconds")
    print(f"📝 Suggestions: {suggestions}")
    
    # Search all suggestions in parallel
    youtube_start = time.time()
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(search_youtube, suggestion, 1) for suggestion in suggestions]
        youtube_results = []
        for i, future in enumerate(futures):
            video_start = time.time()
            videos = future.result()
            video_elapsed = time.time() - video_start
            print(f"🎥 YouTube search #{i+1} took: {video_elapsed:.2f} seconds")
            if videos:
                youtube_results.append(videos[0])
    
    youtube_elapsed = time.time() - youtube_start
    print(f"⏱️  Total YouTube searches took: {youtube_elapsed:.2f} seconds")
    
    total_elapsed = time.time() - total_start
    print(f"✅ TOTAL REQUEST TIME: {total_elapsed:.2f} seconds")
    print("-" * 50)
    
    return {
        "query": request.query,
        "suggestions": suggestions,
        "youtube": youtube_results
    }