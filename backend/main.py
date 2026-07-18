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


app = FastAPI(
    title="AI Travel Concierge - GoTraveller API",
    description="Backend API services for GoTraveller, including the Weather Agent.",
    version="1.0.0"
)

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

    result = generate_trip(
        place=data.place,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=str(data.budget),
        interests=", ".join(data.preferences),
        preferences=", ".join(data.preferences),
        trip_type="Sightseeing"
    )

    return {
        "itinerary": result
    }

if __name__ == "__main__":
    import uvicorn
    # Start the server (default port: 8000)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
