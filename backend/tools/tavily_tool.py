import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()
api_key=os.getenv("TAVILY_API_KEY")

client = TavilyClient(api_key=api_key)

def tavily_search(query):
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