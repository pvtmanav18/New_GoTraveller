import os
import requests
from typing import Dict, Any, Union
from langchain_core.tools import tool

@tool
def get_weather_data(city: str) -> Union[Dict[str, Any], str]:
    """
    Fetches the current weather data for a given city from the Weatherstack API.
    Use this tool when you need to answer questions about the current temperature, 
    weather descriptions (e.g. sunny, raining, cloudy), wind speed, or humidity 
    for a specific city or location.
    
    Args:
        city (str): The name of the city/location to retrieve weather for.
        
    Returns:
        Union[dict, str]: A clean dictionary containing the weather parameters, 
                          or a string error message if the fetch failed.
    """
    api_key = os.getenv("WEATHERSTACK_API_KEY")
    if not api_key or api_key.lower().strip() in {
        "your_weatherstack_api_key_here", "your_api_key_here", "mock_key", ""
    }:
        return "Error: Weatherstack API Key is not configured. Please configure the WEATHERSTACK_API_KEY environment variable."

    base_url = "http://api.weatherstack.com/current"
    params = {
        "access_key": api_key,
        "query": city
    }

    try:
        # Synchronous HTTP GET request using requests library (10.0s timeout)
        response = requests.get(base_url, params=params, timeout=10.0)
        
        # Check HTTP status code
        response.raise_for_status()
        data = response.json()
        
        # Weatherstack returns errors inside successful HTTP responses (success = False)
        if data.get("success") is False:
            error_info = data.get("error", {})
            error_code = error_info.get("code")
            error_msg = error_info.get("info", "Unknown Weatherstack API error.")
            
            # Map common error codes to polite context-aware error strings
            if error_code == 615:
                return f"Error: Could not fetch weather for '{city}'. Please verify the location spelling."
            elif error_code in (104, 105):
                return "Error: Weather service API limit has been reached. Please try again later."
            elif error_code == 101:
                return "Error: Weatherstack API Key is invalid or expired."
            else:
                return f"Error: Weatherstack API returned error code {error_code}: {error_msg}"
                
        # Validate that necessary fields exist
        if "current" not in data:
            return f"Error: Weather data payload for '{city}' was incomplete."
            
        current = data["current"]
        location_info = data.get("location", {})
        
        # Return optimized JSON schema
        return {
            "city": location_info.get("name", city),
            "country": location_info.get("country", ""),
            "temperature": current.get("temperature"),
            "weather_descriptions": current.get("weather_descriptions", []),
            "wind_speed": current.get("wind_speed"),
            "humidity": current.get("humidity")
        }
        
    except requests.Timeout:
        return f"Error: Request timed out while trying to fetch weather for '{city}'."
    except requests.RequestException as e:
        return f"Error: Could not connect to weather service for '{city}' due to network issues: {str(e)}"
    except Exception as e:
        return f"Error: An unexpected error occurred while fetching weather for '{city}': {str(e)}"
