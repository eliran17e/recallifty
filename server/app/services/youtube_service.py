import os
import requests

def search_youtube(query: str, max_results: int = 3):
    api_key = os.getenv("YOUTUBE_API_KEY")
    base_url = "https://www.googleapis.com/youtube/v3/search"
    
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": api_key
    }
    
    response = requests.get(base_url, params=params)
    data = response.json()
    
    videos = []
    for item in data.get("items", []):
        video_info = {
            "title": item["snippet"]["title"],
            "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
            "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        }
        videos.append(video_info)
    
    return videos
