from pydantic import BaseModel

class TripRequest(BaseModel):
    place: str
    start_date: str
    end_date: str
    budget: str
    interests: str
    preferences: str
    trip_type: str