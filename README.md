# GoTraveller - AI Travel Concierge

GoTraveller is an AI-powered travel concierge and real-time navigation dashboard. It features a **FastAPI backend** leveraging **LangGraph** & **LangChain** for multi-agent travel planning and a modern **Next.js frontend** featuring interactive maps and a live virtual travel guide.

---

## 🚀 Features

- **AI-Powered Travel Planner**: Generates personalized, day-by-day travel itineraries based on destination, dates, budget, travelers, and interests using Groq (`llama-3.3-70b-versatile`) and Tavily Search.
- **Smart Weather Assistant**: Real-time natural language query resolution (e.g. *"Do I need an umbrella in Tokyo today?"*) powered by the Weatherstack API.
- **Interactive Live Map**: Geolocation tracking and route assistance on an interactive Leaflet map.
- **Persistent Memory**: LangGraph PostgreSQL checkpointers preserve user session histories and travel results in a local database.

---

## 📁 Repository Structure

```text
├── backend/               # FastAPI backend codebase
│   ├── agents/            # LangGraph planners and rule-based weather agents
│   ├── api/               # API endpoints (e.g. weather chat)
│   ├── config/            # Dotenv configuration loaders
│   ├── database/          # Database integration helpers
│   ├── services/          # External services (e.g., Weatherstack client)
│   ├── tools/             # Search and weather retrieval tools
│   ├── main.py            # Backend service entrypoint
│   └── requirements.txt   # Python dependency manifest
├── frend/                 # Next.js/React frontend codebase
│   ├── app/               # App Router pages and layouts
│   ├── components/        # Sidebar, dashboard, planning and live views
│   └── package.json       # Node.js project manifest
├── docker/                # Docker configuration files
├── docs/                  # Architecture and API documentation
└── scripts/               # Quick start shell scripts
```

---

## 🛠️ Getting Started

### Prerequisites

Before starting, ensure you have installed:
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **PostgreSQL** running locally

### Environment Configuration

Create a `.env` file in the `backend/` directory based on the following keys:

```ini
# API Credentials
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
WEATHERSTACK_API_KEY=your_weatherstack_api_key_here
SERPAPI_API_KEY=your_serpapi_api_key_here

# Database URL
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/gotraveller
```

---

## 🏃 Running the Application

### 1. Run the Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`. You can access the interactive Swagger documentation at `http://localhost:8000/docs`.

### 2. Run the Frontend (Next.js)

```bash
cd frend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser to view the application dashboard.
