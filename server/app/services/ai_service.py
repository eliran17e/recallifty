import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- FIX ---
# Initialize the model ONCE, here at the module level.
try:
    model = genai.GenerativeModel("models/gemini-2.5-flash")
except Exception as e:
    print(f"[FATAL ERROR] Could not initialize Gemini model: {e}")
    model = None

def get_ai_suggestions(query: str):
    """
    Uses Gemini to generate possible matches for the user's memory description.
    Returns a list of suggestion strings.
    """
    # --- FIX ---
    # Don't re-create the model, just check if it exists
    if model is None:
        return ["Error: Gemini model not initialized"]

    try:
        prompt = f"""
        The user is trying to recall a video, song, or clip.
        Based on this description, suggest 3 possible matches.
        Description: "{query}"
        Respond with short titles only, one per line.
        """

        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        suggestions = [
            line.strip("-• ").strip()
            for line in raw_text.splitlines()
            if line.strip()
        ]
        return suggestions

    except Exception as e:
        print(f"[ERROR] Gemini API call failed: {e}")
        return ["Error: unable to fetch suggestions"]