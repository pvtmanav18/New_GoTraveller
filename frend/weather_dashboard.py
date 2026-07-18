import sys
import os
import asyncio
import streamlit as st
from pathlib import Path

# Setup paths dynamically to allow standalone imports of backend code
project_root = Path(__file__).resolve().parent.parent
backend_dir = project_root / "backend"
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Configure page metadata and layout
st.set_page_config(
    page_title="GoTraveller 🌤️ Weather Concierge",
    page_icon="🌤️",
    layout="wide"
)

# Custom premium styling
st.markdown("""
<style>
    /* Main Layout */
    .stApp {
        background-color: #0b0f19;
        color: #f1f5f9;
    }
    
    /* Headers & Text */
    h1, h2, h3 {
        font-family: 'Inter', sans-serif !important;
        font-weight: 700 !important;
    }
    .main-title {
        background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.8rem;
        font-weight: 800;
        margin-bottom: 5px;
    }
    .sub-title {
        color: #94a3b8;
        font-size: 1.1rem;
        margin-bottom: 25px;
    }

    /* Cards & Containers */
    .dashboard-card {
        background: rgba(30, 41, 59, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
    }
    .weather-temp-val {
        font-size: 4.5rem;
        font-weight: 800;
        color: #38bdf8;
        line-height: 1;
        margin: 15px 0 5px 0;
        letter-spacing: -2px;
    }
    .weather-loc-header {
        font-size: 1.4rem;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 5px;
    }
    .weather-country {
        font-size: 0.9rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    /* Badges */
    .weather-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        background-color: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(56, 189, 248, 0.3);
        margin-top: 5px;
    }

    /* Metrics Grid */
    .metric-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 20px;
    }
    .metric-item {
        background: rgba(15, 23, 42, 0.4);
        padding: 15px;
        border-radius: 12px;
        border: 1px solid rgba(51, 65, 85, 0.4);
    }
    .metric-label {
        font-size: 0.8rem;
        color: #94a3b8;
        margin-bottom: 5px;
    }
    .metric-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #f1f5f9;
    }

    /* Alerts */
    .alert-box {
        padding: 16px;
        border-radius: 12px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .alert-blue {
        background-color: rgba(59, 130, 246, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: #60a5fa;
    }
    .alert-orange {
        background-color: rgba(249, 115, 22, 0.15);
        border: 1px solid rgba(249, 115, 22, 0.3);
        color: #fb923c;
    }
    .alert-green {
        background-color: rgba(34, 197, 94, 0.15);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: #4ade80;
    }

    /* Chat Messages */
    .chat-bubble {
        padding: 14px 18px;
        border-radius: 18px;
        max-width: 85%;
        margin-bottom: 15px;
        line-height: 1.5;
        font-size: 0.95rem;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    }
    .chat-user {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
        text-align: right;
    }
    .chat-agent {
        background-color: #1e293b;
        color: #e2e8f0;
        margin-right: auto;
        border-bottom-left-radius: 4px;
        border: 1px solid rgba(51, 65, 85, 0.6);
        text-align: left;
    }
</style>
""", unsafe_allow_html=True)

# Session state initialization for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
if "weather_data" not in st.session_state:
    st.session_state.weather_data = None
if "last_location" not in st.session_state:
    st.session_state.last_location = None

# Header Banner
st.markdown('<div class="main-title">GoTraveller Weather Agent</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">An agentic travel concierge answering weather questions in natural language.</div>', unsafe_allow_html=True)

# Check and warn if Weatherstack key is missing from environment
from backend.config.dotenv_loader import is_key_configured
if not is_key_configured():
    st.warning("⚠️ Weatherstack API Key is not configured. Please add your `WEATHERSTACK_API_KEY` to the `backend/.env` file.")

# Split Main UI into two columns (7:5 ratio)
col_chat, col_dash = st.columns([7, 5], gap="large")

with col_chat:
    st.markdown("### 💬 Chat")
    
    # Render chat history
    for msg in st.session_state.messages:
        role_class = "chat-user" if msg["role"] == "user" else "chat-agent"
        st.markdown(f'<div class="chat-bubble {role_class}">{msg["content"]}</div>', unsafe_allow_html=True)

    # Chat Input Field
    query_input = st.text_input(
        "Ask the Weather Agent:",
        placeholder="e.g. Do I need a coat in Oslo today?",
        key="query_input_field"
    )

    # Async response call wrapper using Standalone direct imports
    async def call_agent(query: str):
        try:
            from backend.agents.weather_agent import WeatherAgent
            agent = WeatherAgent()
            result = await agent.process_query_detailed(query)
            return result
        except Exception as e:
            return {
                "response": f"Execution failed. Error: {str(e)}",
                "weather_data": None,
                "extracted_location": None
            }

    # Submit button
    if st.button("Send Query", type="primary") and query_input.strip():
        # Append User message
        st.session_state.messages.append({"role": "user", "content": query_input})
        
        # Display loader spinner
        with st.spinner("Weather Agent is analyzing your query..."):
            result = asyncio.run(call_agent(query_input))
            
            # Save responses to history
            st.session_state.messages.append({"role": "assistant", "content": result["response"]})
            st.session_state.weather_data = result.get("weather_data")
            st.session_state.last_location = result.get("extracted_location")
            
        # Rerun to update chat list and dashboard
        st.rerun()

# Dashboard Column (Right Side)
with col_dash:
    st.markdown("### 📊 Live Weather Dashboard")
    
    weather = st.session_state.weather_data
    loc_name = st.session_state.last_location
    
    if weather:
        city = weather.get("location_name", loc_name)
        country = weather.get("country", "")
        temp = weather.get("temperature")
        feels_like = weather.get("feelslike")
        humidity = weather.get("humidity")
        wind = weather.get("wind_speed")
        descriptions = weather.get("weather_descriptions", [])
        desc_text = descriptions[0] if descriptions else "N/A"
        obs_time = weather.get("observation_time", "N/A")
        
        # Render main temperature card (Aligned left to fix Markdown indentation parsing bug)
        st.markdown(f"""<div class="dashboard-card">
<div class="weather-country">{country}</div>
<div class="weather-loc-header">{city}</div>
<div class="weather-badge">{desc_text}</div>
<div class="weather-temp-val">{temp}°C</div>
<div style="font-size: 0.95rem; color: #94a3b8; margin-top: 10px;">Observed at ⌚ {obs_time}</div>
<div class="metric-grid">
<div class="metric-item">
<div class="metric-label">Feels Like</div>
<div class="metric-value">{feels_like}°C</div>
</div>
<div class="metric-item">
<div class="metric-label">Wind Speed</div>
<div class="metric-value">💨 {wind} km/h</div>
</div>
<div class="metric-item">
<div class="metric-label">Humidity</div>
<div class="metric-value">💧 {humidity}%</div>
</div>
<div class="metric-item">
<div class="metric-label">Comfort Index</div>
<div class="metric-value">🌡️ {"Pleasant" if 15 <= temp <= 26 else "Extremes"}</div>
</div>
</div>
</div>""", unsafe_allow_html=True)
        
        # Alert warning generator
        desc_lower = desc_text.lower()
        rain_keywords = ["rain", "drizzle", "shower", "storm", "thunderstorm", "precipitation", "sleet", "snow"]
        is_raining = any(k in desc_lower for k in rain_keywords) or (humidity and humidity > 90)
        
        if is_raining:
            alert_class = "alert-blue"
            alert_text = "🌧️ **Umbrella Alert**: Bring an umbrella! Rain or extreme humidity is observed in this area."
        elif temp and temp >= 28:
            alert_class = "alert-orange"
            alert_text = "🔥 **Heat Alert**: High temperatures observed. Remember to carry water and wear sunblock."
        elif temp and temp <= 10:
            alert_class = "alert-blue"
            alert_text = "❄️ **Cold Alert**: Cold weather conditions. Don't forget your winter coat."
        else:
            alert_class = "alert-green"
            alert_text = "☀️ **Nice Weather**: Good travel conditions. No active weather alerts."
            
        st.markdown(f'<div class="alert-box {alert_class}">{alert_text}</div>', unsafe_allow_html=True)
        
    else:
        # Placeholder view if no data queried yet (Aligned left to fix Markdown indentation parsing bug)
        st.markdown("""<div class="dashboard-card" style="text-align: center; padding: 50px 20px;">
<img src="https://img.icons8.com/clouds/100/000000/sun.png" style="margin-bottom: 20px;" />
<h4 style="color: #64748b;">No query data loaded</h4>
<p style="color: #475569; font-size: 0.9rem;">Ask a question in the chat panel to populate this weather metrics dashboard.</p>
</div>""", unsafe_allow_html=True)
