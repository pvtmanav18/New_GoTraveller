from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.planenr import generate_trip

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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