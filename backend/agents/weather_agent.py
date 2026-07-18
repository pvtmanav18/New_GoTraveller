import re
from typing import Optional, Dict, Any
from backend.tools.weather_tool import get_current_weather

class WeatherAgent:
    def __init__(self):
        # Precompiled patterns for location extraction
        self.location_patterns = [
            # e.g., "weather in London", "weather for Paris"
            r'(?i)\bweather\s+(?:in|at|for|of|around)\s+([a-zA-Z\s\-]+)',
            # e.g., "weather Paris"
            r'(?i)\bweather\s+([a-zA-Z\s\-]+)',
            # e.g., "umbrella in London", "rain in Tokyo"
            r'(?i)\b(?:umbrella|rain|temp|temperature|wind|humidity)\s+(?:in|at|for|of|around)\s+([a-zA-Z\s\-]+)',
            # e.g., "how is the weather in New York"
            r'(?i)\bweather\s+in\s+([a-zA-Z\s\-]+)',
            # e.g., "in Paris today", "at Cairo right now"
            r'(?i)\b(?:in|at|for|around)\s+([a-zA-Z\s\-]+)',
        ]
        
        # Stop words to clean trailing time/politeness contexts from extracted location
        self.time_and_polite_words = {
            "today", "tomorrow", "tonight", "now", "currently", "right", "week",
            "please", "forecast", "report", "here", "there", "this", "next"
        }

    def extract_location(self, query: str) -> Optional[str]:
        """
        Extracts location name from a natural language query using heuristics.
        
        Args:
            query: The natural language query from the user.
            
        Returns:
            The extracted city/location name, or None if not found.
        """
        query = query.strip()
        if not query:
            return None
            
        # Fallback: if query is extremely short (1-2 words) and contains no action verbs,
        # it is likely just the location name itself (e.g., "London" or "New York").
        words = query.split()
        if len(words) <= 2 and not any(w.lower() in {"weather", "show", "get", "what", "how", "is", "need", "umbrella", "rain"} for w in words):
            return re.sub(r'[^\w\s-]', '', query).strip()

        for pattern in self.location_patterns:
            match = re.search(pattern, query)
            if match:
                loc = match.group(1).strip()
                # Clean punctuation (like trailing question marks)
                loc = re.sub(r'[^\w\s-]', '', loc).strip()
                
                # Split and filter out trailing time/polite contexts (e.g. "London today" -> "London")
                loc_words = loc.split()
                cleaned_words = []
                for w in loc_words:
                    if w.lower() in self.time_and_polite_words:
                        break
                    cleaned_words.append(w)
                
                cleaned_loc = " ".join(cleaned_words).strip()
                if cleaned_loc:
                    return cleaned_loc

        # Last resort: search for "in <word>"
        match = re.search(r'(?i)\bin\s+([a-zA-Z\-]+)', query)
        if match:
            return match.group(1).strip()

        return None

    async def process_query(self, query: str) -> str:
        """
        Processes a natural language query, retrieves weather info,
        and constructs a helpful conversational response.
        
        Args:
            query: The user's query (e.g., "Do I need an umbrella in London today?")
            
        Returns:
            A conversational string response.
        """
        result = await self.process_query_detailed(query)
        return result["response"]

    async def process_query_detailed(self, query: str) -> Dict[str, Any]:
        """
        Processes a query and returns a dictionary with the conversational response,
        the extracted location, and the raw weather data (if successful).
        
        Args:
            query: The user's query.
            
        Returns:
            A dictionary containing "response", "extracted_location", and "weather_data".
        """
        location = self.extract_location(query)
        if not location:
            return {
                "response": (
                    "I couldn't quite extract the location from your query. "
                    "Could you please specify which city or location you're asking about? "
                    "For example: 'How is the weather in London today?'"
                ),
                "extracted_location": None,
                "weather_data": None
            }

        # Call the weather tool
        result = await get_current_weather(location)
        
        # Handle errors gracefully
        if not result.get("success"):
            error_type = result.get("error_type")
            error_msg = result.get("error_message")
            
            response = ""
            if error_type == "MISSING_API_KEY":
                response = (
                    "I'm sorry, but I can't fetch the weather right now because the "
                    "Weatherstack API key has not been configured in the backend `.env` file. "
                    "Please ask the administrator to configure the `WEATHERSTACK_API_KEY`."
                )
            elif error_type == "INVALID_LOCATION":
                response = (
                    f"I'm sorry, but I couldn't find a city or location named '{location}'. "
                    "Could you please check the spelling and try again?"
                )
            elif error_type == "RATE_LIMIT_EXCEEDED":
                response = (
                    "I apologize, but the weather service API rate limit has been exceeded. "
                    "Please try again in a little while."
                )
            else:
                response = (
                    f"I apologize, but I encountered an error while retrieving the weather for '{location}': "
                    f"{error_msg}. Please try again later."
                )
            return {
                "response": response,
                "extracted_location": location,
                "weather_data": None
            }

        # Build natural language response based on query intent
        weather_data = result["data"]
        loc_name = weather_data["location_name"]
        country = weather_data["country"]
        temp = weather_data["temperature"]
        descriptions = weather_data["weather_descriptions"]
        desc = descriptions[0] if descriptions else "clear"
        wind = weather_data["wind_speed"]
        humidity = weather_data["humidity"]
        feels_like = weather_data["feelslike"]
        obs_time = weather_data["observation_time"]
        
        query_lower = query.lower()
        response_text = ""
        
        # Intent 1: Umbrella / Rain
        if any(keyword in query_lower for keyword in ["umbrella", "rain", "rainy", "drizzle", "shower", "storm"]):
            rain_keywords = ["rain", "drizzle", "shower", "storm", "thunderstorm", "precipitation", "sleet"]
            desc_lower = desc.lower()
            is_raining = any(k in desc_lower for k in rain_keywords) or humidity > 90
            
            if is_raining:
                response_text = (
                    f"Yes, you should definitely bring an umbrella! In {loc_name} ({country}), "
                    f"it is currently '{desc}' with a temperature of {temp}°C (feels like {feels_like}°C), "
                    f"humidity of {humidity}%, and wind speed of {wind} km/h."
                )
            else:
                response_text = (
                    f"No, you probably don't need an umbrella in {loc_name} ({country}) right now. "
                    f"The current weather is '{desc}' with a temperature of {temp}°C, "
                    f"humidity of {humidity}%, and no rain observed."
                )
                
        # Intent 2: Hot / Warm
        elif any(keyword in query_lower for keyword in ["hot", "warm", "heat", "summer"]):
            if temp >= 28:
                response_text = (
                    f"Yes, it is quite hot in {loc_name} ({country}) right now! "
                    f"The temperature is {temp}°C (feels like {feels_like}°C) with '{desc}' conditions."
                )
            else:
                response_text = (
                    f"No, it's not particularly hot in {loc_name} ({country}) at the moment. "
                    f"The current temperature is {temp}°C with '{desc}' skies."
                )

        # Intent 3: Cold / Chilly
        elif any(keyword in query_lower for keyword in ["cold", "chilly", "freezing", "winter"]):
            if temp <= 10:
                response_text = (
                    f"Yes, it is cold in {loc_name} ({country})! "
                    f"The temperature is {temp}°C (feels like {feels_like}°C) with '{desc}' skies."
                )
            else:
                response_text = (
                    f"No, it's not very cold in {loc_name} ({country}) right now. "
                    f"The current temperature is {temp}°C (feels like {feels_like}°C)."
                )

        # Intent 4: Wind / Windy
        elif any(keyword in query_lower for keyword in ["wind", "windy", "breeze", "gale"]):
            if wind >= 25:
                response_text = (
                    f"Yes, it's quite windy in {loc_name} ({country}) today. "
                    f"The wind speed is currently {wind} km/h with '{desc}' conditions."
                )
            else:
                response_text = (
                    f"No, it is not very windy in {loc_name} ({country}). "
                    f"The wind speed is a gentle {wind} km/h."
                )

        # Intent 5: General weather query
        else:
            country_suffix = f", {country}" if country else ""
            response_text = (
                f"The current weather in {loc_name}{country_suffix} is '{desc}'. "
                f"The temperature is {temp}°C (which feels like {feels_like}°C) with a "
                f"humidity of {humidity}% and wind speed of {wind} km/h (observed at {obs_time})."
            )

        return {
            "response": response_text,
            "extracted_location": location,
            "weather_data": weather_data
        }
