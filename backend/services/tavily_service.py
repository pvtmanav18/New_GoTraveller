from tavily import TavilyClient
import os

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_places(location):

    query = f"""
    Best tourist attractions in or near {location}
    """

    response = client.search(
        query=query,
        max_results=5
    )

    places = []

    for r in response["results"]:
        places.append({
            "name": r.get("title"),
            "description": r.get("content"),
            "url": r.get("url")
        })

    return places