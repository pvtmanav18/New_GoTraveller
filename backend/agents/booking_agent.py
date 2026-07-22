import os
import json
import psycopg
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load env variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

class BookingAgent:
    def __init__(self):
        pass

    def get_hotel_options(self, destination: str, budget: str, preferences: str = "", start_date: str = "", end_date: str = "") -> list:
        """Searches for hotels in the target destination using SerpAPI's Google Hotels engine."""
        if not SERPAPI_API_KEY:
            print("⚠️ SERPAPI_API_KEY not found in environment. Falling back to mock hotels.")
            return self._get_fallback_hotels(destination, budget)

        # Calculate budget limits based on trip duration
        try:
            d1 = datetime.strptime(start_date, "%Y-%m-%d")
            d2 = datetime.strptime(end_date, "%Y-%m-%d")
            nights = max(1, (d2 - d1).days)
        except Exception:
            nights = 7 # Default fallback nights

        try:
            num_budget = int("".join([c for c in str(budget) if c.isdigit()]))
        except ValueError:
            num_budget = 50000

        # lodging receives approximately 75% of total budget
        nightly_limit = int((num_budget * 0.75) / nights)

        # Dynamically compute future check-in/check-out dates (e.g. 30 days from now)
        try:
            today = datetime.now()
            check_in_dt = today + timedelta(days=30)
            check_out_dt = check_in_dt + timedelta(days=nights)
            
            check_in = check_in_dt.strftime("%Y-%m-%d")
            check_out = check_out_dt.strftime("%Y-%m-%d")
        except Exception:
            # Fallback static dates if datetime fails
            check_in = "2026-10-15"
            check_out = "2026-10-22"

        url = "https://serpapi.com/search"
        params = {
            "engine": "google_hotels",
            "q": f"hotels in {destination} under ₹{nightly_limit} {preferences}".strip(),
            "check_in_date": check_in,
            "check_out_date": check_out,
            "max_price": nightly_limit,
            "currency": "INR",
            "api_key": SERPAPI_API_KEY
        }

        print(f"🔎 BookingAgent querying SerpAPI Google Hotels for destination '{destination}' (Dates: {check_in} to {check_out})")
        
        try:
            response = httpx.get(url, params=params, timeout=15.0)
            if response.status_code != 200:
                print(f"⚠️ SerpAPI request failed with status code {response.status_code}. Falling back.")
                return self._get_fallback_hotels(destination, budget)
                
            data = response.json()
            properties = data.get("properties", [])
            
            if not properties:
                print("⚠️ SerpAPI returned empty properties. Falling back.")
                return self._get_fallback_hotels(destination, budget)

            structured_hotels = []
            for hotel in properties[:4]:
                name = hotel.get("name", "Unknown Hotel")
                
                # Extract rating safely
                rating_val = hotel.get("overall_rating")
                rating = f"{rating_val}/5" if rating_val is not None else "N/A"
                
                # Extract price safely
                rate_per_night = hotel.get("rate_per_night", {})
                lowest_rate = rate_per_night.get("lowest")
                if lowest_rate is not None:
                    price_str = str(lowest_rate)
                    if "₹" not in price_str and "$" not in price_str and "Rs." not in price_str:
                        price_str = f"₹{price_str}"
                    price = price_str if "/night" in price_str else f"{price_str}/night"
                else:
                    price = "N/A"

                description = hotel.get("description", "A premium accommodation option found in the area.")
                amenities = hotel.get("amenities", [])[:4]
                if not amenities:
                    amenities = ["Free Wi-Fi", "Air Conditioning"]

                booking_link = hotel.get("link", "https://google.com/travel/hotels")

                structured_hotels.append({
                    "name": name,
                    "price": price,
                    "rating": rating,
                    "description": description,
                    "amenities": amenities,
                    "booking_link": booking_link
                })
                
            return structured_hotels

        except Exception as e:
            print(f"❌ Error during SerpAPI hotel retrieval: {e}. Falling back.")
            return self._get_fallback_hotels(destination, budget)

    def _get_fallback_hotels(self, destination: str, budget: str) -> list:
        # Determine fallback prices based on budget input
        try:
            num_budget = int("".join([c for c in str(budget) if c.isdigit()]))
        except ValueError:
            num_budget = 50000

        # Divide overall budget by a nominal 5 nights to get average nightly budget
        nightly_budget = num_budget // 5
        if nightly_budget < 2000:
            nightly_budget = 2000
        
        return [
            {
                "name": f"Grand Oasis Resort {destination}",
                "price": f"₹{int(nightly_budget * 0.9)}/night",
                "rating": "4.6/5",
                "description": "A luxury retreat in the heart of the city offering panoramic views and world-class service.",
                "amenities": ["Free Wi-Fi", "Infinity Pool", "Fitness Center", "Spa"],
                "booking_link": "https://www.booking.com"
            },
            {
                "name": f"{destination} Boutique Inn",
                "price": f"₹{int(nightly_budget * 0.7)}/night",
                "rating": "4.4/5",
                "description": "Cozy, charming, and walking distance to all major historical sights and local dining.",
                "amenities": ["Free Breakfast", "Free Wi-Fi", "Air Conditioning", "Bicycle Rental"],
                "booking_link": "https://www.booking.com"
            },
            {
                "name": f"Eco-Lodge & Suites {destination}",
                "price": f"₹{int(nightly_budget * 0.5)}/night",
                "rating": "4.2/5",
                "description": "Affordable sustainable lodging with modern facilities, perfect for environmentally conscious travelers.",
                "amenities": ["Eco-friendly", "Free Wi-Fi", "Kitchenette", "Pet Friendly"],
                "booking_link": "https://www.booking.com"
            }
        ]

    def book_hotel(self, hotel_name: str, destination: str, price: str) -> bool:
        """Logs a booked hotel in the database."""
        if not DATABASE_URL:
            return False

        try:
            with psycopg.connect(DATABASE_URL) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO bookings (hotel_name, destination, price, status)
                        VALUES (%s, %s, %s, 'Confirmed')
                        """,
                        (hotel_name, destination, price)
                    )
                conn.commit()
                print(f"✅ Hotel '{hotel_name}' booked successfully in database!")
                return True
        except Exception as e:
            print(f"Error booking hotel in database: {e}")
            return False
