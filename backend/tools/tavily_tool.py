import os
from tavily import TavilyClient
from dotenv import load_dotenv

# Load env variables using robust absolute path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(backend_dir, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

_client = None

def get_tavily_client():
    global _client
    if _client is None:
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            raise ValueError("TAVILY_API_KEY environment variable is not configured.")
        _client = TavilyClient(api_key=api_key)
    return _client

def tavily_search(query):
    client = get_tavily_client()
    response = client.search(
        query=query,
        max_results=3
    )

    result = [ ]

    for i, r in enumerate(response["results"], 1):
        title = r.get("title", "Unknown")
        url = r.get("url", "")
        snippet = r.get("content", "").strip()

        if len(snippet) > 300:
            snippet = snippet[:300].rsplit(" ", 1)[0] + "..."

        result.append(f"{i}. **{title}**\n {url}\n {snippet}")

    return "\n\n".join(result)