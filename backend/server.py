# backend/server.py

import os
import io
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from map_generator import generate_risk_map

app = FastAPI()

# CORS so your React app can call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

UA_JSON = os.path.join(os.path.dirname(__file__), "ua.json")

# === Generate & cache the map once at startup ===
try:
    _cached_map = generate_risk_map(UA_JSON)
    print(f"🗺️  Risk map ready at -> http://localhost:8000/risk-map/png")
except Exception as e:
    print(f"❌ Map generation failed: {e}")
    _cached_map = None

@app.get("/risk-map/png")
def get_risk_map():
    if _cached_map is None:
        raise HTTPException(status_code=500, detail="Map not available")
    return StreamingResponse(io.BytesIO(_cached_map), media_type="image/png")
