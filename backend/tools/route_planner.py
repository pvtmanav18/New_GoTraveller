# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("GEOAPIFY_API_KEY")


# def generate_route(places):

#     url = f"https://api.geoapify.com/v1/routeplanner?apiKey={API_KEY}"

#     jobs = []

#     for i, place in enumerate(places):

#         jobs.append({
#             "id": str(i),
#             "location": [
#                 place["lng"],
#                 place["lat"]
#             ]
#         })


#     body = {

#         "mode": "drive",

#         "agents": [
#             {
#                 "id": "vehicle",

#                 "start_location": jobs[0]["location"],

#                 "end_location": jobs[0]["location"]
#             }
#         ],

#         "jobs": jobs
#     }


#     response = requests.post(url, json=body)
#     response.raise_for_status()

#     data = response.json()

#     properties = data["features"][0]["properties"]

#     geometry = data["features"][0]["geometry"]

#     route_order = []

#     for action in properties["actions"]:

#         if action["type"] == "job":

#             idx = int(action["job_id"])

#             route_order.append(
#                 places[idx]
#             )

#     route_order.append(route_order[0])

#     return {
#         "distance": properties["distance"],
#         "time": properties["time"],
#         "legs": properties["legs"],
#         "geometry": geometry,
#         "route": route_order
#     }


import os
import requests
from dotenv import load_dotenv

API_KEY = os.getenv("GEOAPIFY_API_KEY", "ceaf5fcfaf6043c6bd74c47e8eb10cf0")


def generate_route(places):
    """
    1. Optimize stop order using Route Planner API.
    2. Fetch the actual road route using Routing API.
    """

    # -------------------------------------------------
    # Route Planner API (Optimization)
    # -------------------------------------------------

    planner_url = f"https://api.geoapify.com/v1/routeplanner?apiKey={API_KEY}"

    jobs = []

    for i, place in enumerate(places):
        jobs.append({
            "id": str(i),
            "location": [
                place["lng"],
                place["lat"]
            ]
        })

    body = {
        "mode": "drive",
        "agents": [
            {
                "id": "vehicle",
                "start_location": jobs[0]["location"],
                "end_location": jobs[0]["location"]
            }
        ],
        "jobs": jobs
    }

    response = requests.post(planner_url, json=body)
    response.raise_for_status()

    planner = response.json()

    properties = planner["features"][0]["properties"]

    route_order = []

    for action in properties["actions"]:

        if action["type"] == "job":
            idx = int(action["job_id"])
            route_order.append(places[idx])

    # Return to starting point
    route_order.append(route_order[0])

    # -------------------------------------------------
    # Routing API (Road Geometry)
    # -------------------------------------------------

    routing_url = "https://api.geoapify.com/v1/routing"

    # Geoapify expects lon,lat
    waypoints = "|".join(
        f"{p['lat']},{p['lng']}"
        for p in route_order
    )

    params = {
        "waypoints": waypoints,
        "mode": "drive",
        "details": "instruction_details",
        "apiKey": API_KEY
    }

    routing_response = requests.get(routing_url, params=params)
    routing_response.raise_for_status()

    road = routing_response.json()

    # import json

    # print(json.dumps(road, indent=2))
    # print({
    #     "distance": properties["distance"],
    #     "time": properties["time"],
    #     "legs": properties["legs"],
    #     "route": route_order,
    #     "road": road
    # })

    return {
        "distance": properties["distance"],
        "time": properties["time"],
        "legs": properties["legs"],
        "route": route_order,
        "road": road
    }