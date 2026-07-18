from typing import Dict, Any
from backend.services.weather_service import (
    WeatherService,
    WeatherAPIError,
    MissingAPIKeyError,
    InvalidLocationError,
    RateLimitExceededError
)

async def get_current_weather(location: str) -> Dict[str, Any]:
    """
    Tool function to fetch current weather for a specified location.
    
    Args:
        location: The location/city to search weather for.
        
    Returns:
        A dictionary with the following schema:
        {
            "success": True/False,
            "data": {
                "location_name": str,
                "country": str,
                "temperature": int,
                "weather_descriptions": List[str],
                "wind_speed": int,
                "humidity": int,
                "feelslike": int,
                "observation_time": str
            } (if success is True),
            "error_type": str, (if success is False)
            "error_message": str (if success is False)
        }
    """
    try:
        raw_data = await WeatherService.get_current_weather(location)
        current = raw_data["current"]
        loc_info = raw_data.get("location", {})
        
        return {
            "success": True,
            "data": {
                "location_name": loc_info.get("name", location),
                "country": loc_info.get("country", ""),
                "temperature": current.get("temperature"),
                "weather_descriptions": current.get("weather_descriptions", []),
                "wind_speed": current.get("wind_speed"),
                "humidity": current.get("humidity"),
                "feelslike": current.get("feelslike"),
                "observation_time": current.get("observation_time")
            }
        }
    except MissingAPIKeyError as e:
        return {
            "success": False,
            "error_type": "MISSING_API_KEY",
            "error_message": str(e)
        }
    except InvalidLocationError as e:
        return {
            "success": False,
            "error_type": "INVALID_LOCATION",
            "error_message": str(e)
        }
    except RateLimitExceededError as e:
        return {
            "success": False,
            "error_type": "RATE_LIMIT_EXCEEDED",
            "error_message": str(e)
        }
    except WeatherAPIError as e:
        return {
            "success": False,
            "error_type": "API_ERROR",
            "error_message": str(e)
        }
    except Exception as e:
        return {
            "success": False,
            "error_type": "UNKNOWN_ERROR",
            "error_message": f"An unexpected error occurred: {str(e)}"
        }
