from pydantic import BaseModel

class SearchRequest(BaseModel):
    """
    Defines the expected structure of the POST /search/memory request body.
    """
    query: str
