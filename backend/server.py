import os
import io
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse

from map_generator import generate_risk_map, generate_risk_map_for_partner
from pdf_report_generator import create_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

UA_JSON = os.path.join(os.path.dirname(__file__), "ua.json")

# Cache full map and per-partner maps at startup
try:
    _cached_full = generate_risk_map(UA_JSON)
    _cached_partner = {
        p: generate_risk_map_for_partner(UA_JSON, p)
        for p in ("A", "B", "C")
    }
    print(f"🗺️  Cached endpoints ready: "
          f"http://localhost:8000/risk-map/png  "
          f"and http://localhost:8000/risk-map/png?partner=A|B|C")
except Exception as e:
    print(f"❌ Map generation failed: {e}")
    _cached_full = None
    _cached_partner = {}

@app.get("/risk-map/png")
def get_risk_map(partner: str = Query(None, regex="^[ABC]$")):
    """
    If ?partner=A|B|C is provided, returns that slice;
    otherwise returns the full map.
    """
    if partner:
        img = _cached_partner.get(partner)
        if not img:
            raise HTTPException(404, f"No map for partner {partner}")
        return StreamingResponse(io.BytesIO(img), media_type="image/png")

    if not _cached_full:
        raise HTTPException(500, "Map not available")
    return StreamingResponse(io.BytesIO(_cached_full), media_type="image/png")

@app.post("/generate-pdf")
def generate_pdf():
    output_path = create_pdf()
    return FileResponse(output_path, filename="ngo_activity_report.pdf", media_type="application/pdf")