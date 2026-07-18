import os
from pathlib import Path
from dotenv import load_dotenv

# Find .env starting from the directory of this file up to parent directories
current_dir = Path(__file__).resolve().parent
env_paths = [
    current_dir / ".env",
    current_dir.parent / ".env",
    current_dir.parent.parent / ".env",
    Path.cwd() / ".env",
    Path.cwd().parent / ".env"
]

# Attempt to load from the first .env file found
loaded = False
for path in env_paths:
    if path.exists():
        load_dotenv(dotenv_path=path)
        loaded = True
        break

if not loaded:
    load_dotenv()

WEATHERSTACK_API_KEY = os.getenv("WEATHERSTACK_API_KEY")

def get_api_key() -> str:
    """Retrieve the API key or return empty string if missing."""
    return WEATHERSTACK_API_KEY or ""

def is_key_configured() -> bool:
    """Verify if the API key has been properly configured by the user."""
    key = get_api_key().strip()
    if not key:
        return False
    # Check if it is a placeholder value
    placeholders = {
        "your_weatherstack_api_key_here",
        "your_api_key_here",
        "mock_key",
        "placeholder",
        "api_key"
    }
    return key.lower() not in placeholders
