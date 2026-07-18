import os
import requests
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("GOOGLE_MAP_KEY")


def get_transport_options(origin_lat, origin_lng, dest_lat, dest_lng):
    """
    Returns travel information for different transportation modes.
    """

    modes = ["driving", "walking", "bicycling", "transit"]
    results = {}

    for mode in modes:

        url = "https://maps.googleapis.com/maps/api/directions/json"

        params = {
            "origin": f"{origin_lat},{origin_lng}",
            "destination": f"{dest_lat},{dest_lng}",
            "mode": mode,
            "key": KEY
        }

        response = requests.get(url, params=params).json()

        if response["status"] == "OK":

            leg = response["routes"][0]["legs"][0]

            results[mode] = {
                "distance": leg["distance"]["text"],
                "duration": leg["duration"]["text"]
            }

        else:

            results[mode] = {
                "error": response.get("status")
            }

    return results