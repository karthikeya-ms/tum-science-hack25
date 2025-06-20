import geopandas as gpd
import numpy as np
import random
from shapely.geometry import Point, box
from shapely.ops import unary_union
import matplotlib.pyplot as plt

# === Step 1: Load Ukraine boundary from your GeoJSON ===
# Replace with your actual path
ukraine_path = "ua.json"
ukraine = gpd.read_file(ukraine_path)
ukraine = ukraine.to_crs("EPSG:4326")

# === Step 1: Define a 100 km radius area around Kharkiv (~31,000 km²) ===
center_lat, center_lon = 49.988, 36.232
radius_km = 100
radius_deg = radius_km / 111  # Approx conversion
kharkiv_region = Point(center_lon, center_lat).buffer(radius_deg)

# === Step 2: Generate multiple risk "blobs" inside Kharkiv region ===
blob_radius_km = 7  # each blob ≈ 154 km²
blob_radius_deg = blob_radius_km / 111
target_area_km2 = 31000
num_blobs = int(target_area_km2 / (np.pi * blob_radius_km**2))

minx, miny, maxx, maxy = kharkiv_region.bounds
blobs = []

while len(blobs) < num_blobs:
    x = random.uniform(minx, maxx)
    y = random.uniform(miny, maxy)
    point = Point(x, y)
    if kharkiv_region.contains(point):
        blobs.append(point.buffer(blob_radius_deg))

mine_zone = unary_union(blobs)
mine_zone_gdf = gpd.GeoDataFrame(geometry=[mine_zone], crs="EPSG:4326")

# === Step 3: Discretize into ~1 km² grid cells ===
resolution = 0.01  # ~1 km
minx, miny, maxx, maxy = mine_zone.bounds
grid_cells = []

x = minx
while x < maxx:
    y = miny
    while y < maxy:
        cell = box(x, y, x + resolution, y + resolution)
        if mine_zone.contains(cell):
            risk = max(0, min(1, random.gauss(0.5, 0.2)))
            grid_cells.append({"geometry": cell, "risk": risk})
        y += resolution
    x += resolution

mine_risk_gdf = gpd.GeoDataFrame(grid_cells, crs="EPSG:4326")

# Optional: Clip to Ukraine boundary
mine_risk_gdf = gpd.overlay(mine_risk_gdf, ukraine, how="intersection")

# === Step 4: Save and visualize ===
mine_risk_gdf.to_file("synthetic_kharkiv_mine_risk.json", driver="GeoJSON")

fig, ax = plt.subplots(figsize=(10, 10))
ukraine.boundary.plot(ax=ax, color='black')
ukraine.plot(ax=ax, color='white', alpha=0.2)
mine_risk_gdf.plot(column='risk', cmap='Reds', ax=ax, legend=True)
plt.title("Synthetic Landmine Risk (~31,000 km²) Around Kharkiv")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.tight_layout()
plt.show()