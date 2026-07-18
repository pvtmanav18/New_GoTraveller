# import requests
# import os

# KEY = os.getenv("GOOGLE_MAP_KEY")

# def geocode(place):

#     url = "https://maps.googleapis.com/maps/api/geocode/json"

#     params = {
#         "address": place,
#         "key": KEY
#     }

#     data = requests.get(url, params=params).json()

#     loc = data["results"][0]["geometry"]["location"]

#     return loc["lat"], loc["lng"]

import os
import requests
from dotenv import load_dotenv

load_dotenv()

KEY = os.getenv("GOOGLE_MAP_KEY")


def geocode(place):
    """
    Convert a place name into latitude and longitude.
    """

    url = "https://maps.googleapis.com/maps/api/geocode/json"

    params = {
        "address": place,
        "key": KEY
    }

    response = requests.get(url, params=params).json()

    if response["status"] != "OK":
        raise Exception(f"Could not geocode '{place}'")

    location = response["results"][0]["geometry"]["location"]

    return location["lat"], location["lng"]


def optimize_route(coordinates):
    """
    Creates an optimized driving route through all places.
    """

    if len(coordinates) < 2:
        return "Need at least two places to create a route."

    origin = f"{coordinates[0]['lat']},{coordinates[0]['lng']}"
    destination = f"{coordinates[-1]['lat']},{coordinates[-1]['lng']}"

    # Intermediate stops
    waypoints = []

    for place in coordinates[1:-1]:
        waypoints.append(f"{place['lat']},{place['lng']}")

    waypoint_string = "optimize:true"

    if waypoints:
        waypoint_string += "|" + "|".join(waypoints)

    url = "https://maps.googleapis.com/maps/api/directions/json"

    params = {
        "origin": origin,
        "destination": destination,
        "waypoints": waypoint_string,
        "key": KEY
    }

    response = requests.get(url, params=params).json()

    if response["status"] != "OK":
        return response

    route = response["routes"][0]

    return {
        "summary": route.get("summary"),
        "distance": route["legs"][-1]["distance"]["text"],
        "duration": route["legs"][-1]["duration"]["text"],
        "polyline": route["overview_polyline"]["points"]
    }