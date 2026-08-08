from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import TripRequest
from main import generate_trip

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-trip")
def trip(request: TripRequest):

    result = generate_trip(
        place=request.place,
        start_date=request.start_date,
        end_date=request.end_date,
        budget=request.budget,
        interests=request.interests,
        preferences=request.preferences,
        trip_type=request.trip_type,
    )

    return result