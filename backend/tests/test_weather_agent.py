import sys
import unittest
from unittest.mock import patch, AsyncMock
from pathlib import Path

# Setup path dynamically to import backend modules
backend_dir = Path(__file__).resolve().parent.parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from backend.agents.weather_agent import WeatherAgent
from backend.services.weather_service import MissingAPIKeyError, InvalidLocationError, RateLimitExceededError

class TestWeatherAgent(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.agent = WeatherAgent()

    def test_location_extraction(self):
        test_cases = [
            ("Do I need an umbrella in London today?", "London"),
            ("Is it hot in Cairo right now?", "Cairo"),
            ("How is the weather in New York?", "New York"),
            ("weather for Paris please", "Paris"),
            ("London", "London"),
            ("weather Tokyo", "Tokyo"),
            ("What is the wind speed in Seattle today?", "Seattle"),
            ("How hot is it in Rio de Janeiro tomorrow?", "Rio de Janeiro"),
            ("give me the temperature around San Francisco", "San Francisco"),
        ]
        for query, expected in test_cases:
            with self.subTest(query=query):
                self.assertEqual(self.agent.extract_location(query), expected)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_successful_weather_response_umbrella(self, mock_get_weather):
        # Mock weather service to return raining weather
        mock_get_weather.return_value = {
            "location": {"name": "London", "country": "United Kingdom"},
            "current": {
                "temperature": 15,
                "weather_descriptions": ["Light Rain"],
                "wind_speed": 10,
                "humidity": 95,
                "feelslike": 14,
                "observation_time": "08:00 AM"
            }
        }
        
        response = await self.agent.process_query("Do I need an umbrella in London today?")
        self.assertIn("Yes, you should definitely bring an umbrella", response)
        self.assertIn("London", response)
        self.assertIn("Light Rain", response)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_successful_weather_response_no_umbrella(self, mock_get_weather):
        # Mock weather service to return sunny weather
        mock_get_weather.return_value = {
            "location": {"name": "London", "country": "United Kingdom"},
            "current": {
                "temperature": 22,
                "weather_descriptions": ["Sunny"],
                "wind_speed": 5,
                "humidity": 50,
                "feelslike": 22,
                "observation_time": "02:00 PM"
            }
        }
        
        response = await self.agent.process_query("Do I need an umbrella in London today?")
        self.assertIn("No, you probably don't need an umbrella", response)
        self.assertIn("London", response)
        self.assertIn("Sunny", response)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_successful_weather_response_hot(self, mock_get_weather):
        mock_get_weather.return_value = {
            "location": {"name": "Cairo", "country": "Egypt"},
            "current": {
                "temperature": 35,
                "weather_descriptions": ["Sunny"],
                "wind_speed": 15,
                "humidity": 20,
                "feelslike": 37,
                "observation_time": "01:00 PM"
            }
        }
        
        response = await self.agent.process_query("Is it hot in Cairo?")
        self.assertIn("Yes, it is quite hot in Cairo", response)
        self.assertIn("35°C", response)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_error_missing_api_key(self, mock_get_weather):
        mock_get_weather.side_effect = MissingAPIKeyError("API Key is missing")
        
        response = await self.agent.process_query("What is the weather in London?")
        self.assertIn("API key has not been configured", response)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_error_invalid_location(self, mock_get_weather):
        mock_get_weather.side_effect = InvalidLocationError("Could not find location")
        
        response = await self.agent.process_query("What is the weather in InvalidCity?")
        self.assertIn("couldn't find a city or location named", response)

    @patch("backend.tools.weather_tool.WeatherService.get_current_weather")
    async def test_error_rate_limit(self, mock_get_weather):
        mock_get_weather.side_effect = RateLimitExceededError("Rate limit exceeded")
        
        response = await self.agent.process_query("What is the weather in London?")
        self.assertIn("rate limit has been exceeded", response)

if __name__ == "__main__":
    unittest.main()
    print("✅ All test suites passed!")
