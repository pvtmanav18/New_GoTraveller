import os
import requests
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("GOOGLE_MAP_KEY")


def nearby_restaurants(lat, lng):
    """
    Search for nearby restaurants using Google Places API.
    """

    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    params = {
        "location": f"{lat},{lng}",
        "radius": 3000,
        "type": "restaurant",
        "key": KEY
    }

    response = requests.get(url, params=params).json()

    restaurants = []

    for restaurant in response.get("results", []):
        restaurants.append({
            "name": restaurant.get("name"),
            "rating": restaurant.get("rating", "N/A"),
            "address": restaurant.get("vicinity"),
            "location": restaurant.get("geometry", {}).get("location", {}),
            "price_level": restaurant.get("price_level", "Unknown")
        })

    return restaurants