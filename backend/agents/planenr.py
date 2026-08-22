from typing import TypedDict, Annotated
import operator
import os
import json
import psycopg
from datetime import datetime
from dotenv import load_dotenv

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver

from langchain_core.messages import (
AnyMessage,
HumanMessage,
AIMessage,
SystemMessage,
)

from langchain_groq import ChatGroq

from tools.tavily_tool import tavily_search

# --------------------------------------------------

# Load Environment Variables

# --------------------------------------------------

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env")

# --------------------------------------------------

# LLM

# --------------------------------------------------

llm = ChatGroq(
model="openai/gpt-oss-120b"
)

# --------------------------------------------------

# State

# --------------------------------------------------

class TravelState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    
    place: str
    start_date: str
    end_date: str
    budget: str
    interests: str
    preferences: str
    trip_type: str

    hotel_results: str
    itinerary: str
    final_response: str
    # llm_calls: int

# --------------------------------------------------

# Hotel Agent

# --------------------------------------------------

def hotel_agent(state: TravelState):
    # Calculate duration of trip in nights
    try:
        d1 = datetime.strptime(state['start_date'], "%Y-%m-%d")
        d2 = datetime.strptime(state['end_date'], "%Y-%m-%d")
        nights = max(1, (d2 - d1).days)
    except Exception:
        nights = 5
        
    try:
        num_budget = int("".join([c for c in str(state['budget']) if c.isdigit()]))
    except ValueError:
        num_budget = 50000

    # Budget approximately 75% for lodging
    nightly_limit = int((num_budget * 0.75) / nights)

    query = f"affordable hotels in {state['place']} under ₹{nightly_limit} INR per night - {state['preferences']}"
    print(f"🔎 LangGraph Hotel Agent querying Tavily: {query}")
    hotel_results = tavily_search(query)

    return {
    "hotel_results": hotel_results,
    "messages": [
        AIMessage(content="Hotel information collected.")
    ],
    }

# --------------------------------------------------

# Itinerary Agent

# --------------------------------------------------

def itinerary_agent(state: TravelState):

    prompt = f"""
        Create a detailed travel itinerary.

        Destination:
        {state['place']}

        Travel Dates:
        {state['start_date']} to {state['end_date']}

        Budget:
        {state['budget']}

        Trip Type:
        {state['trip_type']}

        Interests:
        {state['interests']}

        Preferences:
        {state['preferences']}

        Hotel Information:
        {state['hotel_results']}

        Generate:

        1. Day-wise itinerary
        2. Recommended attractions
        3. Food recommendations
        4. Estimated expenses
        5. Transportation suggestions
        6. Travel tips
        """
    
    response = llm.invoke(
        [
            SystemMessage(
                content="You are an expert travel planner."
            ),
            HumanMessage(content=prompt),
        ]
    )

    return {
        "itinerary": response.content,
        "messages": [response],
        # # "llm_calls": state.get("llm_calls", 0) + 1,
    }

# --------------------------------------------------

# Final Agent

# --------------------------------------------------

def final_agent(state: TravelState):

    prompt = f"""
        Generate a professional travel plan.

        Destination: {state['place']}
        Dates: {state['start_date']} to {state['end_date']}
        Budget: {state['budget']}
        Trip Type: {state['trip_type']}
        Interests: {state['interests']}
        Preferences: {state['preferences']}

        Hotel Information:
        {state['hotel_results']}

        Itinerary:
        {state['itinerary']}

        Format the output with:

        # Trip Overview
        # Hotel Recommendations
        # Day-wise Itinerary
        # Budget Breakdown
        # Travel Tips
        """

    response = llm.invoke(
        [HumanMessage(content=prompt)]
    )

    return {
        "final_response": response.content,
        "messages": [response],
        # # "llm_calls": state.get("llm_calls", 0) + 1,
    }

# --------------------------------------------------

# Graph

# --------------------------------------------------

graph = StateGraph(TravelState)

graph.add_node("hotel_agent", hotel_agent)
graph.add_node("itinerary_agent", itinerary_agent)
graph.add_node("final_agent", final_agent)

graph.add_edge(START, "hotel_agent")
graph.add_edge("hotel_agent", "itinerary_agent")
graph.add_edge("itinerary_agent", "final_agent")
graph.add_edge("final_agent", END)

# --------------------------------------------------

# PostgreSQL Checkpointer

# --------------------------------------------------

conn = psycopg.connect(
DATABASE_URL,
autocommit=True,
)

checkpointer = PostgresSaver(conn)
checkpointer.setup()

app = graph.compile(
checkpointer=checkpointer
)


def save_trip_result(
    place,
    start_date,
    end_date,
    budget,
    interests,
    preferences,
    trip_type,
    final_response
):

    with psycopg.connect(DATABASE_URL) as conn:

        with conn.cursor() as cur:

            cur.execute(
                """
                INSERT INTO travel_results
                (
                    place,
                    start_date,
                    end_date,
                    budget,
                    interests,
                    preferences,
                    trip_type,
                    result
                )
                VALUES
                (
                    %s,%s,%s,%s,%s,%s,%s,%s
                )
                """,
                (
                    place,
                    start_date,
                    end_date,
                    budget,
                    interests,
                    preferences,
                    trip_type,
                    json.dumps({
                        "travel_plan": final_response
                    })
                )
            )

        conn.commit()

# --------------------------------------------------

# Main

# --------------------------------------------------

def generate_trip(
    place: str,
    start_date: str,
    end_date: str,
    budget: str,
    interests: str,
    preferences: str,
    trip_type: str,
):
    
    result = app.invoke(
        {
            "messages": [
                HumanMessage(content=f"Trip to {place}")
            ],
            "place": place,
            "start_date": start_date,
            "end_date": end_date,
            "budget": budget,
            "interests": interests,
            "preferences": preferences,
            "trip_type": trip_type,
            "hotel_results": "",
            "itinerary": "",
            "final_response": "",
        },
        config={
            "configurable": {
                "thread_id": "web_user"
            }
        }
    )

    final_plan = result["final_response"]

    # Save JSON result
    save_trip_result(
        place,
        start_date,
        end_date,
        budget,
        interests,
        preferences,
        trip_type,
        final_plan
    )


    return final_plan

