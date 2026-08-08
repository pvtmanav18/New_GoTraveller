import sys
import os
import re
import operator
import httpx
import psycopg
from pathlib import Path
from typing import TypedDict, Annotated
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Set up system paths dynamically to support running from different CWDs
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# LangGraph and LLM imports
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver
from langchain_core.messages import AnyMessage, HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq

# Sub-module imports
from tools.tavily_tool import tavily_search
from tools.geocoordinates import geo_coordinate
from tools.route_planner import generate_route

from backend.api.routes.weather_routes import router as weather_router
from backend.config.dotenv_loader import is_key_configured
from backend.database.init_db import init_db
from backend.agents.booking_agent import BookingAgent

load_dotenv()

app = FastAPI(
    title="AI Travel Concierge - GoTraveller API",
    description="Backend API services for GoTraveller, including routing agents.",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    init_db()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(weather_router, prefix="/api")

# --------------------------------------------------
# LLM Setup
# --------------------------------------------------
llm = ChatGroq(
    model="llama-3.3-70b-versatile"
)

# --------------------------------------------------
# TravelState TypedDict
# --------------------------------------------------
class TravelState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    place: str
    start_date: str
    end_date: str
    budget: str
    interests: str
    preferences: str
    trip_type: str
    hotel_results: str
    itinerary: str
    final_response: str
    locations: list
    route: dict

# --------------------------------------------------
# Hotel Agent
# --------------------------------------------------
def hotel_agent(state: TravelState):
    query = f"""
        Best hotels in {state['place']}
        Budget: {state['budget']}
        Preferences: {state['preferences']}
        """
    hotel_results = tavily_search(query)
    return {
        "hotel_results": hotel_results,
        "messages": [
            AIMessage(content="Hotel information collected.")
        ],
    }

# --------------------------------------------------
# Itinerary Agent
# --------------------------------------------------
def itinerary_agent(state: TravelState):
    prompt = f"""
        Create a detailed travel itinerary.

        Destination:
        {state['place']}

        Travel Dates:
        {state['start_date']} to {state['end_date']}

        Budget:
        {state['budget']}

        Trip Type:
        {state['trip_type']}

        Interests:
        {state['interests']}

        Preferences:
        {state['preferences']}

        Hotel Information:
        {state['hotel_results']}

        Generate:

        1. Day-wise itinerary
        2. Recommended attractions
        4. Opening/closing hours
        5. Visit duration
        6. Food recommendations
        7. Estimated expenses
        8. Transportation suggestions
        9. Travel tips
        10. Only Visiting Places complete address:
            Example: " Science City, Ahmedabad, Gujarat 380060, India " # exclude hotel and restaurants
        """
    response = llm.invoke(
        [
            SystemMessage(content="You are an expert travel planner."),
            HumanMessage(content=prompt),
        ]
    )
    return {
        "itinerary": response.content,
        "messages": [response],
    }

# --------------------------------------------------
# Final Agent
# --------------------------------------------------
def final_agent(state: TravelState):
    prompt = f"""
        Generate a professional travel plan.

        Destination: {state['place']}
        Dates: {state['start_date']} to {state['end_date']}
        Budget: {state['budget']}
        Trip Type: {state['trip_type']}
        Interests: {state['interests']}
        Preferences: {state['preferences']}

        Hotel Information:
        {state['hotel_results']}

        Itinerary:
        {state['itinerary']}

        Format the output with:

        # Trip Overview
        # Opening/closing hours
        # Visit duration
        # Hotel Recommendations
        # Day-wise Itinerary
        # Budget Breakdown
        # Travel Tips
        # Only Visiting Places complete address:
            Example: " Science City, Ahmedabad, Gujarat 380060, India " # exclude hotel and restaurants
        """
    response = llm.invoke(
        [HumanMessage(content=prompt)]
    )
    data = response.content
    places = []
    locations = []

    capture = False
    for line in data.splitlines():
        if "Visiting Places" in line:
            capture = True
            continue
        if capture and line.strip():
            line = line.strip()
            place = re.sub(r"^(\d+[.)]\s*|[-*•]\s*)", "", line).strip()
            if place:
                places.append(place)

    for place in places:
        try:
            geo = geo_coordinate(place)
            if geo:
                locations.append(geo)
        except Exception as e:
            print(f"Error geocoding place {place}: {e}")

    route = {}
    if len(locations) >= 2:
        try:
            route = generate_route(locations)
        except Exception as e:
            print(f"Error generating route planner path: {e}")

    return {
        "final_response": response.content,
        "locations": locations,
        "route": route,
        "messages": [response],
    }

# --------------------------------------------------
# Compile Graph
# --------------------------------------------------
graph = StateGraph(TravelState)
graph.add_node("hotel_agent", hotel_agent)
graph.add_node("itinerary_agent", itinerary_agent)
graph.add_node("final_agent", final_agent)

graph.add_edge(START, "hotel_agent")
graph.add_edge("hotel_agent", "itinerary_agent")
graph.add_edge("itinerary_agent", "final_agent")
graph.add_edge("final_agent", END)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env")

conn = psycopg.connect(
    DATABASE_URL,
    autocommit=True,
)
checkpointer = PostgresSaver(conn)
checkpointer.setup()
travel_graph = graph.compile(
    checkpointer=checkpointer
)

# --------------------------------------------------
# Pydantic Request Models
# --------------------------------------------------
class TripRequest(BaseModel):
    place: str
    start_date: str
    end_date: str
    budget: int
    travelers: int
    preferences: list[str]

class BookHotelRequest(BaseModel):
    hotel_name: str
    destination: str
    price: str

# --------------------------------------------------
# API Endpoints
# --------------------------------------------------
@app.get("/")
def read_root():
    """Root health check endpoint."""
    return {
        "status": "online",
        "service": "GoTraveller Backend API",
        "weather_agent_ready": True,
        "weather_api_key_configured": is_key_configured()
    }

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")

@app.get("/api/search-destination")
def search_destination(query: str):
    """Geocodes a destination search text query using Geoapify API."""
    if not query:
        return []
    if not GEOAPIFY_API_KEY:
        print("⚠️ GEOAPIFY_API_KEY is not configured in .env. Returning empty results.")
        return []

    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": query,
        "apiKey": GEOAPIFY_API_KEY
    }
    
    try:
        response = httpx.get(url, params=params, timeout=10.0)
        if response.status_code != 200:
            print(f"⚠️ Geoapify API failed with status {response.status_code}.")
            return []
            
        data = response.json()
        results = []
        for feature in data.get("features", []):
            props = feature.get("properties", {})
            name = props.get("formatted", props.get("name", "Unknown Place"))
            lat = props.get("lat")
            lon = props.get("lon")
            country = props.get("country", "Unknown")
            
            results.append({
                "name": name,
                "lat": lat,
                "lng": lon,
                "country": country,
                "bestSeason": "Nov - Feb",
                "avgTemp": "22°C",
                "crowdLevel": "Moderate",
                "advisory": f"Dynamic location advisory for {name}.",
                "safetyScore": 85,
                "currency": "INR",
                "language": "Local",
                "timezone": props.get("timezone", {}).get("name", "GMT")
            })
        return results
    except Exception as e:
        print(f"❌ Error during Geoapify search: {e}")
        return []

@app.post("/plan-trip")
async def plan_trip(data: TripRequest):
    # Invoke the travel state graph flow
    result = travel_graph.invoke(
        {
            "messages": [
                HumanMessage(content=f"Trip to {data.place}")
            ],
            "place": data.place,
            "start_date": data.start_date,
            "end_date": data.end_date,
            "budget": str(data.budget),
            "interests": ", ".join(data.preferences),
            "preferences": ", ".join(data.preferences),
            "trip_type": "Sightseeing",
            "hotel_results": "",
            "itinerary": "",
            "final_response": "",
            "locations": [],
            "route": {}
        },
        config={
            "configurable": {
                "thread_id": "web_user"
            }
        }
    )

    # Get hotel options based on destination and budget
    try:
        booking_agent = BookingAgent()
        hotels = booking_agent.get_hotel_options(
            destination=data.place,
            budget=str(data.budget),
            preferences=", ".join(data.preferences),
            start_date=data.start_date,
            end_date=data.end_date
        )
    except Exception as e:
        print(f"Error fetching hotels in route: {e}")
        hotels = []

    return {
        "itinerary": result["final_response"],
        "hotels": hotels,
        "locations": result["locations"],
        "route": result["route"]
    }

@app.post("/generate-trip")
def generate_trip_endpoint(
    place: str,
    start_date: str,
    end_date: str,
    budget: str,
    interests: str,
    preferences: str,
    trip_type: str,
):
    result = travel_graph.invoke(
        {
            "messages": [
                HumanMessage(content=f"Trip to {place}")
            ],
            "place": place,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "interests": interests,
            "preferences": preferences,
            "trip_type": trip_type,
            "hotel_results": "",
            "itinerary": "",
            "final_response": "",
            "locations": [],
            "route": {}
        },
        config={
            "configurable": {
                "thread_id": "web_user"
            }
        }
    )
    return {
        "travel_plan": result["final_response"],
        "locations": result["locations"],
        "route": result["route"]
    }

@app.post("/api/book-hotel")
async def book_hotel(data: BookHotelRequest):
    try:
        booking_agent = BookingAgent()
        success = booking_agent.book_hotel(
            hotel_name=data.hotel_name,
            destination=data.destination,
            price=data.price
        )
        return {"success": success}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
