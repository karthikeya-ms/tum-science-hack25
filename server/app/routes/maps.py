import os
from fastapi import APIRouter
from typing import List

from map_generator import generate_risk_map, generate_risk_map_for_partner, _build_gdf


from app.core.custom_exceptions import (
    ResourceNotFoundException,
    InternalServerErrorException,
    BadDataException,
)

router = APIRouter(prefix="/maps", tags=["maps"])

ua_json_path = os.path.join("files", "ua.json")

_cached_full = None
_cached_partner = {}
_cached_gdf = None

try:
    _cached_gdf = _build_gdf(ua_json_path)
except Exception as e:
    raise InternalServerErrorException("Failed to build GDF from ua.json")


@app.get("/{partner}")
def get_map_for_partner(partner: str) -> 
