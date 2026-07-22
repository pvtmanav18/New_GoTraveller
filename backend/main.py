import sys
from pathlib import Path

# Set up system paths dynamically to support running from different CWDs
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes.weather_routes import router as weather_router
from backend.config.dotenv_loader import is_key_configured
from pydantic import BaseModel

from agents.planenr import generate_trip
from backend.database.init_db import init_db
from backend.agents.booking_agent import BookingAgent

app = FastAPI(
    title="AI Travel Concierge - GoTraveller API",
    description="Backend API services for GoTraveller, including the Weather Agent.",
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

@app.get("/")
def read_root():
    """Root health check endpoint."""
    return {
        "status": "online",
        "service": "GoTraveller Backend API",
        "weather_agent_ready": True,
        "weather_api_key_configured": is_key_configured()
    }

class TripRequest(BaseModel):
    place: str
    start_date: str
    end_date: str
    budget: int
    travelers: int
    preferences: list[str]

@app.post("/plan-trip")
async def plan_trip(data: TripRequest):
    # Generate the personalized itinerary
    result = generate_trip(
        place=data.place,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=str(data.budget),
        interests=", ".join(data.preferences),
        preferences=", ".join(data.preferences),
        trip_type="Sightseeing"
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
        "itinerary": result,
        "hotels": hotels
    }

class BookHotelRequest(BaseModel):
    hotel_name: str
    destination: str
    price: str

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
    # Start the server (default port: 8000)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
