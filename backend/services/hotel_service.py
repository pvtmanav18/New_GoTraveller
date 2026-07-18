import os
import requests
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("GOOGLE_MAP_KEY")

def nearby_hotels(lat, lng):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    params = {
        "location": f"{lat},{lng}",
        "radius": 3000,
        "type": "lodging",
        "key": KEY
    }

    response = requests.get(url, params=params)

    return response.json()