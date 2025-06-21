import os
import io
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
import json

from map_generator import generate_risk_map, generate_risk_map_for_partner, _build_gdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

UA_JSON = os.path.join(os.path.dirname(__file__), "ua.json")

# Cache full map and per-partner maps at startup
_cached_full = None
_cached_partner = {}
_cached_gdf = None

print("🚀 Starting server...")
try:
    print("📍 Generating full map...")
    _cached_full = generate_risk_map(UA_JSON)
    print("✅ Full map cached")
    
    print("📍 Generating partner maps...")
    _cached_partner = {
        p: generate_risk_map_for_partner(UA_JSON, p)
        for p in ("A", "B", "C")
    }
    print("✅ Partner maps cached")
    
    # Cache GeoDataFrame for GeoJSON endpoints
    print("📍 Building GeoDataFrame...")
    _cached_gdf = _build_gdf(UA_JSON)
    print("✅ GeoDataFrame cached")
    
    print(f"🗺️  Cached endpoints ready: "
          f"http://localhost:8000/risk-map/png  "
          f"and http://localhost:8000/risk-map/png?partner=A|B|C")
except Exception as e:
    print(f"❌ Map generation failed: {e}")

@app.get("/risk-map/png")
def get_risk_map(partner: str = Query(None, regex="^[ABC]$")):
    """
    If ?partner=A|B|C is provided, returns that slice;
    otherwise returns the full map.
    """
    print(f"🔍 GET /risk-map/png called with partner={partner}")
    
    if partner:
        print(f"🎯 Looking for partner {partner} map...")
        img = _cached_partner.get(partner)
        if not img:
            print(f"❌ No map found for partner {partner}")
            raise HTTPException(404, f"No map for partner {partner}")
        print(f"✅ Returning {len(img)} bytes for partner {partner}")
        # Returning as plain Response avoids potential hanging of StreamingResponse
        return Response(content=img, media_type="image/png")

    print("🗺️ Returning full map...")
    if not _cached_full:
        print("❌ Full map not available")
        raise HTTPException(500, "Map not available")
    print(f"✅ Returning {len(_cached_full)} bytes for full map")
    # Returning as plain Response avoids potential hanging of StreamingResponse
    return Response(content=_cached_full, media_type="image/png")

@app.get("/risk-map/geojson")
def get_risk_map_geojson(partner: str = Query(None, regex="^[ABC]$")):
    """
    Returns GeoJSON data for the specified partner's region or all regions.
    """
    if _cached_gdf is None:
        raise HTTPException(500, "GeoDataFrame not available")
    
    gdf = _cached_gdf.copy()
    
    # Drop columns that aren't JSON serializable
    columns_to_keep = ['geometry', 'risk', 'partner']
    gdf_clean = gdf[columns_to_keep]
    
    if partner:
        # Filter for specific partner
        partner_gdf = gdf_clean[gdf_clean['partner'] == partner]
        if partner_gdf.empty:
            raise HTTPException(404, f"No data for partner {partner}")
        return json.loads(partner_gdf.to_json())
    else:
        # Return all partner data
        assigned_gdf = gdf_clean[gdf_clean['partner'] != 'Unassigned']
        return json.loads(assigned_gdf.to_json())

@app.get("/health")
def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "cached_full": _cached_full is not None, "cached_partners": list(_cached_partner.keys())}
