import httpx
from typing import Dict, Any, Optional
from backend.config.dotenv_loader import get_api_key, is_key_configured

class WeatherAPIError(Exception):
    """Base exception for Weather Service errors."""
    def __init__(self, message: str, code: Optional[int] = None):
        super().__init__(message)
        self.message = message
        self.code = code

class MissingAPIKeyError(WeatherAPIError):
    """Raised when the API key is missing or not configured."""
    pass

class InvalidLocationError(WeatherAPIError):
    """Raised when the location is invalid/not found."""
    pass

class RateLimitExceededError(WeatherAPIError):
    """Raised when the API rate limit is exceeded or restricted."""
    pass

class WeatherService:
    BASE_URL = "http://api.weatherstack.com/current"

    @classmethod
    async def get_current_weather(cls, location: str) -> Dict[str, Any]:
        """
        Fetches current weather for a location from Weatherstack.
        
        Args:
            location: The name of the city/location.
            
        Returns:
            A dictionary containing the parsed weather data.
            
        Raises:
            MissingAPIKeyError: If API key is not configured.
            InvalidLocationError: If the location is invalid.
            RateLimitExceededError: If rate limit is hit.
            WeatherAPIError: For other API-level errors or network failures.
        """
        if not is_key_configured():
            raise MissingAPIKeyError(
                "Weatherstack API Key is not configured. Please add a valid "
                "WEATHERSTACK_API_KEY in your .env file."
            )

        api_key = get_api_key()
        params = {
            "access_key": api_key,
            "query": location
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(cls.BASE_URL, params=params)
                
                # Check for HTTP status errors first
                response.raise_for_status()
                data = response.json()
                
            # Weatherstack returns errors inside a 200 OK response under the 'success' key
            if data.get("success") is False:
                error_info = data.get("error", {})
                error_code = error_info.get("code")
                error_msg = error_info.get("info", "Unknown Weatherstack API error.")
                
                # Handle specific Weatherstack error codes
                if error_code == 615:  # Request failed (often means city not found)
                    raise InvalidLocationError(
                        f"Could not find weather data for the location: '{location}'. Please check the spelling.",
                        code=error_code
                    )
                elif error_code in (104, 105):  # Monthly limit reached / API blocked
                    raise RateLimitExceededError(
                        "Weatherstack API rate limit exceeded or subscription restricted. Please try again later.",
                        code=error_code
                    )
                elif error_code == 101:  # Missing/invalid key
                    raise MissingAPIKeyError(
                        "Weatherstack API Key is invalid or expired. Please update it in your .env file.",
                        code=error_code
                    )
                else:
                    raise WeatherAPIError(
                        f"Weatherstack API error: {error_msg}",
                        code=error_code
                    )
            
            # Validate required fields exist in successful responses
            if "current" not in data:
                raise WeatherAPIError("Weatherstack response is missing 'current' data object.")
                
            return data
            
        except httpx.HTTPStatusError as e:
            raise WeatherAPIError(f"HTTP error occurred while calling Weatherstack: {e.response.status_code}")
        except httpx.RequestError as e:
            raise WeatherAPIError(f"Network error occurred while calling Weatherstack: {e}")
        except ValueError as e:
            raise WeatherAPIError(f"Failed to parse Weatherstack API response: {e}")


# import requests
# import os

# API = os.getenv("WEATHER_API_KEY")

# def weather(city):

#     url = f"http://api.weatherapi.com/v1/current.json?key={API}&q={city}"

#     data = requests.get(url).json()

#     return {
#         "temp": data["current"]["temp_c"],
#         "condition": data["current"]["condition"]["text"],
#         "humidity": data["current"]["humidity"]
#     }