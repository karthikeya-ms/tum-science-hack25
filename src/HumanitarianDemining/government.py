import geopandas as gpd
import numpy as np
import random
from shapely.geometry import Point, box
from shapely.ops import unary_union
import matplotlib.pyplot as plt
from rtree import index as rtree_index
from collections import deque


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
        else:
            risk = 0
        grid_cells.append({
            'geometry': cell,
            'risk': risk
        })
        y += resolution
    x += resolution

mine_risk_gdf = gpd.GeoDataFrame(grid_cells, crs="EPSG:4326")

# Optional: Clip to Ukraine boundary
mine_risk_gdf = gpd.overlay(mine_risk_gdf, ukraine, how="intersection")

gdf = mine_risk_gdf.copy()

# === Step 4: Save and visualize ===
# mine_risk_gdf.to_file("synthetic_kharkiv_mine_risk.json", driver="GeoJSON")

# === Partner definitions ===
# Define partner : risk share
partners = {
    'A': 10000,
    'B': 7000,
    'C': 3000,
}

# === Normalize shares to sum to 1 ===
total_share = sum(partners.values())
partners = {k: v / total_share for k, v in partners.items()}

# === Calculate total risk and target for each partner ===
total_risk = gdf['risk'].sum()
partner_targets = {p: total_risk * share for p, share in partners.items()}
partner_allocated = {p: 0.0 for p in partners}

# === Add spatial index ===
gdf['id'] = gdf.index
gdf['centroid'] = gdf.geometry.centroid
geom_index = rtree_index.Index()
for i, geom in enumerate(gdf.geometry):
    geom_index.insert(i, geom.bounds)

# === Select initial seed cells ===
def pick_seed(gdf, existing_ids):
    """
    Picks a seed farthest from previously chosen ones
    """
    if not existing_ids:
        # First seed: choose bottom-left
        return gdf.loc[gdf.centroid.y.idxmin()]
    else:
        used = gdf.loc[list(existing_ids)].centroid.to_numpy()
        all_coords = gdf.centroid.to_numpy()
        max_dist = -1
        best_idx = -1
        for idx, c in enumerate(all_coords):
            if idx in existing_ids:
                continue
            d = min(np.linalg.norm(np.array(c.coords[0]) - np.array(u.coords[0])) for u in used)
            if d > max_dist:
                max_dist = d
                best_idx = idx
        return gdf.loc[best_idx]

assigned = {}
seeds = {}
frontiers = {}

used_ids = set()

for partner in partners:
    seed = pick_seed(gdf, used_ids)
    seed_id = seed['id']
    seeds[partner] = seed_id
    frontiers[partner] = deque([seed_id])
    assigned[seed_id] = partner
    partner_allocated[partner] += gdf.loc[seed_id, 'risk']
    used_ids.add(seed_id)

# === Neighbor finder ===
def get_neighbors(cell_id):
    geom = gdf.loc[cell_id].geometry
    bounds = geom.bounds
    candidates = list(geom_index.intersection(bounds))
    neighbors = []
    for idx in candidates:
        if idx == cell_id or idx in assigned:
            continue
        if geom.touches(gdf.loc[idx].geometry):
            neighbors.append(idx)
    return neighbors

# === Flood-fill allocation ===
active = set(partners.keys())
while active:
    for partner in list(active):
        frontier = frontiers[partner]
        if not frontier:
            active.remove(partner)
            continue
        current = frontier.popleft()
        neighbors = get_neighbors(current)

        for nbr in neighbors:
            if nbr in assigned:
                continue
            assigned[nbr] = partner
            partner_allocated[partner] += gdf.loc[nbr, 'risk']
            frontier.append(nbr)
            if partner_allocated[partner] >= partner_targets[partner]:
                active.remove(partner)
                break

# === Finalize GeoDataFrame ===
gdf['partner'] = gdf['id'].map(assigned).fillna("Unassigned")
gdf = gdf.drop(columns=['centroid', 'id'])

# === Save to file ===
gdf.to_file("floodfill_partitioned_risk_multi.json", driver='GeoJSON')

# Print risk allocation summary and targets
print("Risk Allocation Summary:")
for partner, target in partner_targets.items():
    allocated = partner_allocated[partner]
    print(f"Partner {partner}: Target = {target:.2f}, Allocated = {allocated:.2f}, "
          f"Difference = {allocated - target:.2f}")

# Filter only cells with risk > 0
gdf_nonzero = gdf[gdf['risk'] > 0]

# Plot
fig, ax = plt.subplots(figsize=(10, 10))
gdf_nonzero.plot(column='partner', categorical=True, legend=True, ax=ax,
                 cmap='Set2', edgecolor='black', linewidth=0.1)

plt.title("Landmine Risk Cells Allocated to Partners")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.tight_layout()
plt.show()