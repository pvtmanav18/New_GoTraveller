import os
import psycopg
from dotenv import load_dotenv

# Load env from parent directory if needed
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def init_db():
    if not DATABASE_URL:
        print("❌ DATABASE_URL not found in environment!")
        return

    print("🔌 Connecting to database to initialize tables...")
    try:
        with psycopg.connect(DATABASE_URL) as conn:
            with conn.cursor() as cur:
                # Create travel_results table if not exists
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS travel_results (
                        id SERIAL PRIMARY KEY,
                        place VARCHAR(255) NOT NULL,
                        start_date VARCHAR(100),
                        end_date VARCHAR(100),
                        budget VARCHAR(100),
                        interests TEXT,
                        preferences TEXT,
                        trip_type VARCHAR(100),
                        result JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                print("✅ Table 'travel_results' is ready.")

                # Create bookings table if not exists
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS bookings (
                        id SERIAL PRIMARY KEY,
                        hotel_name VARCHAR(255) NOT NULL,
                        destination VARCHAR(255) NOT NULL,
                        price VARCHAR(100),
                        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50) DEFAULT 'Confirmed'
                    );
                """)
                print("✅ Table 'bookings' is ready.")

            conn.commit()
            print("🎉 Database initialization completed successfully.")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")

if __name__ == "__main__":
    init_db()
