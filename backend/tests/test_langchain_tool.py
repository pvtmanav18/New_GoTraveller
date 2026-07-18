import sys
import unittest
from unittest.mock import patch, MagicMock
from pathlib import Path
import requests

# Setup path dynamically to import backend modules
backend_dir = Path(__file__).resolve().parent.parent
project_root = backend_dir.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from backend.tools.langchain_weather_tool import get_weather_data

class TestLangChainWeatherTool(unittest.TestCase):
    def test_tool_metadata(self):
        """Verify that the @tool decorator generates the correct LangChain metadata."""
        # The tool name should match the function name
        self.assertEqual(get_weather_data.name, "get_weather_data")
        
        # The tool description should contain the docstring contents
        self.assertIn("Fetches the current weather data", get_weather_data.description)
        self.assertIn("city", get_weather_data.description)
        
        # The tool args schema should recognize the 'city' string argument
        args_schema = get_weather_data.args
        self.assertIn("city", args_schema)
        self.assertEqual(args_schema["city"]["type"], "string")

    @patch("backend.tools.langchain_weather_tool.os.getenv")
    def test_missing_api_key(self, mock_getenv):
        """Verify handling of missing or placeholder API key."""
        mock_getenv.return_value = "your_weatherstack_api_key_here"
        
        # Invoke the tool directly
        result = get_weather_data.run("Paris")
        self.assertIn("Error: Weatherstack API Key is not configured", result)

    @patch("backend.tools.langchain_weather_tool.requests.get")
    @patch("backend.tools.langchain_weather_tool.os.getenv")
    def test_successful_weather_fetch(self, mock_getenv, mock_get):
        """Verify successful retrieval and token optimization of weather data."""
        mock_getenv.return_value = "valid_test_key"
        
        # Mock weatherstack response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "location": {"name": "Cairo", "country": "Egypt"},
            "current": {
                "temperature": 32,
                "weather_descriptions": ["Clear"],
                "wind_speed": 12,
                "humidity": 45,
                "observation_time": "12:00 PM"
            }
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        # Execute
        result = get_weather_data.run("Cairo")
        
        # Check that we only extract optimized fields
        self.assertIsInstance(result, dict)
        self.assertEqual(result["city"], "Cairo")
        self.assertEqual(result["country"], "Egypt")
        self.assertEqual(result["temperature"], 32)
        self.assertEqual(result["weather_descriptions"], ["Clear"])
        self.assertEqual(result["wind_speed"], 12)
        self.assertEqual(result["humidity"], 45)
        # Ensure we didn't include extra keys like 'observation_time' to optimize tokens
        self.assertNotIn("observation_time", result)

    @patch("backend.tools.langchain_weather_tool.requests.get")
    @patch("backend.tools.langchain_weather_tool.os.getenv")
    def test_invalid_city_name(self, mock_getenv, mock_get):
        """Verify graceful error response when city name is invalid."""
        mock_getenv.return_value = "valid_test_key"
        
        # Mock Weatherstack error response for city not found
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "success": False,
            "error": {
                "code": 615,
                "type": "request_failed",
                "info": "Your API request failed. Please try again or contact support."
            }
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        result = get_weather_data.run("InvalidCityABC")
        
        self.assertIsInstance(result, str)
        self.assertIn("Error: Could not fetch weather for 'InvalidCityABC'", result)
        self.assertIn("Please verify the location spelling", result)

    @patch("backend.tools.langchain_weather_tool.requests.get")
    @patch("backend.tools.langchain_weather_tool.os.getenv")
    def test_request_timeout(self, mock_getenv, mock_get):
        """Verify handling of HTTP timeouts."""
        mock_getenv.return_value = "valid_test_key"
        mock_get.side_effect = requests.Timeout("Timeout occurred")

        result = get_weather_data.run("Tokyo")
        
        self.assertIsInstance(result, str)
        self.assertIn("Error: Request timed out while trying to fetch weather for 'Tokyo'", result)

if __name__ == "__main__":
    unittest.main()
    print("✅ LangChain tool tests passed successfully!")
