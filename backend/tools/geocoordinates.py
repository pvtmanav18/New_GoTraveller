# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("GEOAPIFY_API_KEY")


# def geocode_place(place_name: str):
#     url = "https://api.geoapify.com/v1/geocode/search"

#     params = {
#         "text": place_name,
#         "apiKey": API_KEY,
#         "limit": 1
#     }

#     res = requests.get(url, params=params)
#     data = res.json()

#     if not data.get("features"):
#         return None

#     feature = data["features"][0]
#     props = feature["properties"]

#     return {
#         "name": place_name,
#         "lat": props["lat"],
#         "lng": props["lon"]
#     }


########################################################################################################################################################################
########################################################################################################################################################################


# import os
# import requests
# from rapidfuzz import fuzz
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("GEOAPIFY_API_KEY")


# def geocode_place(place_name: str):
#     query = place_name

#     url = "https://api.geoapify.com/v2/places"

#     params = {
#         "categories": "tourism.sights,heritage,entertainment.museum",
#         "filter": "circle:72.5714,23.0225,30000",  # Ahmedabad center, 30 km radius
#         "limit": 100,
#         "apiKey": "ceaf5fcfaf6043c6bd74c47e8eb10cf0"
#     }

#     res = requests.get(url, params=params)
#     places = res.json()["features"]

#     best = None
#     best_score = 0

#     for place in places:
#         name = place["properties"]["name"]
#         score = fuzz.token_sort_ratio(query.lower(), name.lower())

#         if score > best_score:
#             best_score = score
#             best = place

#     print(query)
#     print(best_score)
#     print(best["properties"]["name"])
#     print(best["properties"]["lat"])
#     print(best["properties"]["lon"])
#     print(best["geometry"]["coordinates"])

#     return {
#         "name": best["properties"]["name"],
#         "lat": best["properties"]["lat"],
#         "lng": best["properties"]["lon"]
#     }

# geocode_place("Adalaj Ni Vav, Adalaj, Gandhinagar, Gujarat")

########################################################################################################################################################################
########################################################################################################################################################################


# import requests

# url = f"https://api.geoapify.com/v1/routematrix?apiKey={API_KEY}"
# headers = {"Content-Type": "application/json"}
# data = '{"mode":"drive","sources":[{"location": [72.48340108777779, 23.143352168222815]}],"targets":[{"location": [72.57965591736935, 23.16803295629921]}]}'
      
# try:
#     resp = requests.post(url, headers=headers, data=data)
#     print(resp.json())
# except requests.exceptions.HTTPError as e:
#     print (e.response.text)

# def geo_matrix(locations):

#     url = f"https://api.geoapify.com/v1/routematrix?apiKey={API_KEY}"

#     body = {
#         "mode": "drive",
#         "sources": [
#             {
#                 "location": locations
#             }
#         ],
#         "targets": [
#             {
#                 "location": locations
#             }
#         ]
#     }

#     response = requests.post(url, json=body)

#     print(response.status_code)
#     print(response.text)

# geo_matrix()

########################################################################################################################################################################
########################################################################################################################################################################


# import requests

# API_KEY = "your_api_key"

# def format_distance(meters):
#     if meters >= 1000:
#         return f"{meters / 1000:.2f} km"
#     return f"{meters} meters"


# def format_time(seconds):
#     hours = seconds // 3600
#     minutes = (seconds % 3600) // 60
#     secs = seconds % 60

#     if hours > 0:
#         return f"{hours} hr {minutes} min"
#     elif minutes > 0:
#         return f"{minutes} min {secs} sec"
#     else:
#         return f"{secs} sec"


# def get_route_matrix(locations):

#     url = f"https://api.geoapify.com/v1/routematrix?apiKey={API_KEY}"

#     headers = {
#         "Content-Type": "application/json"
#     }

#     data = {
#         "mode": "drive",
#         "sources": [
#             {
#                 "location": locations
#             }
#         ],
#         "targets": [
#             {
#                 "location": locations
#             }
#         ]
#     }

#     try:
#         resp = requests.post(url, headers=headers, json=data)
#         result = resp.json()

#         route = result["sources_to_targets"][0][0]

#         distance = route["distance"]
#         time = route["time"]

#         print("Route Details")
#         print("----------------")
#         print("Distance:", format_distance(distance))
#         print("Travel Time:", format_time(time))

#     except Exception as e:
#         print("Error:", e)


# get_route_matrix()


########################################################################################################################################################################
########################################################################################################################################################################


import os
import requests
from rapidfuzz import fuzz
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEOAPIFY_API_KEY", "ceaf5fcfaf6043c6bd74c47e8eb10cf0")


def place_search(query, lat, lon, radius=30000):
    """
    Search nearby places and return the best fuzzy match.
    """

    url = "https://api.geoapify.com/v2/places"

    params = {
        "categories": "tourism.sights,entertainment.museum",
        "filter": f"circle:{lon},{lat},{radius}",
        "limit": 50,
        "apiKey": API_KEY
    }

    res = requests.get(url, params=params)
    places = res.json().get("features", [])

    if not places:
        return None

    best = None
    best_score = 0

    for place in places:
        props = place["properties"]
        name = props.get("name", "")

        score = fuzz.token_sort_ratio(query.lower(), name.lower())

        if score > best_score:
            best_score = score
            best = place

    if best is None:
        return None

    props = best["properties"]

    return {
        "name": props.get("name"),
        "lat": props["lat"],
        "lng": props["lon"],
        "match_score": best_score,
        "source": "places"
    }


def geo_coordinate(place):
    """
    First use Geocoding API.
    If confidence < 50, switch to Places API.
    """

    url = "https://api.geoapify.com/v1/geocode/search"

    params = {
        "text": place,
        "limit": 25,
        "categories": "entertainment.museum",
        "apiKey": API_KEY
    }

    res = requests.get(url, params=params)
    data = res.json()

    if not data.get("features"):
        return None

    feature = data["features"][0]
    props = feature["properties"]
    confidence = props["rank"]["confidence"]

    print("Geocode confidence:", confidence)

    # Good result
    if confidence >= 0.5:        # Geoapify confidence is usually 0-1
        return {
            "name": place,
            "lat": props["lat"],
            "lng": props["lon"],
            "score": confidence,
            "source": "geocode"
        }

    print("Low confidence. Falling back to Places API...")

    # Search around the approximate location returned by geocoding
    place_result = place_search(
        query=place,
        lat=props["lat"],
        lon=props["lon"]
    )

    if place_result:
        return place_result

    # If Places API also fails, return original geocode result
    return {
        "name": place,
        "lat": props["lat"],
        "lng": props["lon"],
        "score": confidence,
        "source": "geocode_low_confidence"
    }