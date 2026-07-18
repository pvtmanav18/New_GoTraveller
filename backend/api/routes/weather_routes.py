from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from backend.agents.weather_agent import WeatherAgent

router = APIRouter(
    prefix="/weather",
    tags=["weather"]
)

# Instantiate the agent once at startup
weather_agent = WeatherAgent()

class ChatRequest(BaseModel):
    query: str = Field(..., description="The natural language weather query (e.g. 'Do I need an umbrella in London today?')")

class ChatResponse(BaseModel):
    query: str = Field(..., description="The original user query")
    extracted_location: Optional[str] = Field(None, description="The location extracted by the agent")
    response: str = Field(..., description="The agent's conversational response")
    weather_data: Optional[dict] = Field(None, description="The raw weather data extracted from the current object")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_weather_agent(request: ChatRequest):
    """
    Interact with the Weather Agent using natural language queries.
    
    The agent will extract the location, call the Weatherstack API,
    and generate a tailored conversational answer.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    try:
        agent_result = await weather_agent.process_query_detailed(request.query)
        
        return ChatResponse(
            query=request.query,
            extracted_location=agent_result["extracted_location"],
            response=agent_result["response"],
            weather_data=agent_result["weather_data"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred within the Weather Agent: {str(e)}"
        )
