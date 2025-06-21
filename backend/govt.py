import geopandas as gpd
import numpy as np
import random
random.seed(42)
from shapely.geometry import Point, box
from shapely.ops import unary_union
import matplotlib.pyplot as plt
from rtree import index as rtree_index
from collections import deque

# === Step 1: Load Ukraine boundary ===
ukraine_path = "backend/ua.json"  # path to your Ukraine GeoJSON
ukraine = gpd.read_file(ukraine_path).to_crs("EPSG:4326")

# === Step 2: Define Kharkiv region (100 km radius) ===
center_lat, center_lon = 49.988, 36.232
radius_km = 100
radius_deg = radius_km / 111
kharkiv_region = Point(center_lon, center_lat).buffer(radius_deg)

# === Step 3: Generate random risk blobs within Kharkiv ===
blob_radius_km = 7
blob_radius_deg = blob_radius_km / 111
target_area_km2 = 31000
num_blobs = int(target_area_km2 / (np.pi * blob_radius_km**2))

minx, miny, maxx, maxy = kharkiv_region.bounds
blobs = []
while len(blobs) < num_blobs:
    x = random.uniform(minx, maxx)
    y = random.uniform(miny, maxy)
    p = Point(x, y)
    if kharkiv_region.contains(p):
        blobs.append(p.buffer(blob_radius_deg))
mine_zone = unary_union(blobs)

# === Step 4: Discretize into ~1 km² grid ===
resolution = 0.01
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
        grid_cells.append({'geometry': cell, 'risk': risk})
        y += resolution
    x += resolution

mine_risk_gdf = gpd.GeoDataFrame(grid_cells, crs="EPSG:4326")
mine_risk_gdf = gpd.overlay(mine_risk_gdf, ukraine, how="intersection")
gdf = mine_risk_gdf.copy()

# === Partner definitions ===
partners = {'A': 10000, 'B': 7000, 'C': 3000}
total_share = sum(partners.values())
partners = {k: v / total_share for k, v in partners.items()}
total_risk = gdf['risk'].sum()
partner_targets = {p: total_risk * share for p, share in partners.items()}
partner_allocated = {p: 0.0 for p in partners}

# === Add spatial index ===
gdf['id'] = gdf.index
gdf['centroid'] = gdf.geometry.centroid
geom_index = rtree_index.Index()
for i, geom in enumerate(gdf.geometry):
    geom_index.insert(i, geom.bounds)

# === Seed selector ===
def pick_seed(gdf, existing_ids):
    if not existing_ids:
        return gdf.loc[gdf.centroid.y.idxmin()]
    used = gdf.loc[list(existing_ids)].centroid.to_numpy()
    all_coords = gdf.centroid.to_numpy()
    best_idx = max(
        ((idx, min(np.linalg.norm(np.array(c.coords[0]) - np.array(u.coords[0])) for u in used))
         for idx, c in enumerate(all_coords) if idx not in existing_ids),
        key=lambda x: x[1])[0]
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

# === Partner flood-fill allocation ===
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

gdf['partner'] = gdf['id'].map(assigned).fillna("Unassigned")
gdf = gdf.drop(columns=['centroid', 'id'])

# === Leader definitions ===
team_leaders = {
    'A': ['A1', 'A2', 'A3'],
    'B': ['B1', 'B2'],
    'C': ['C1'],
}

gdf['leader'] = "Unassigned"

# === Helper to pick well-separated seeds ===
def pick_multiple_seeds(local_gdf, num_seeds):
    centroids = np.array([pt.coords[0] for pt in local_gdf.geometry.centroid])
    chosen = []
    remaining = list(range(len(local_gdf)))
    if not remaining:
        return []
    first = np.argmin(centroids[:, 1] + centroids[:, 0])
    chosen.append(first)
    remaining.remove(first)
    while len(chosen) < num_seeds and remaining:
        dists = [(min(np.linalg.norm(centroids[i] - centroids[c]) for c in chosen), i) for i in remaining]
        dists.sort(reverse=True)
        chosen.append(dists[0][1])
        remaining.remove(dists[0][1])
    return local_gdf.iloc[chosen].index.tolist()

# === Subdivide each partner into contiguous leader zones ===
for partner, leaders in team_leaders.items():
    sub_gdf = gdf[gdf.partner == partner].copy()
    sub_gdf['orig_id'] = sub_gdf.index
    sub_gdf = sub_gdf.reset_index(drop=True)
    sub_gdf['sub_id'] = sub_gdf.index
    target_cells = len(sub_gdf) // len(leaders)

    geom_idx = rtree_index.Index()
    for i, geom in enumerate(sub_gdf.geometry):
        geom_idx.insert(i, geom.bounds)

    seed_ids = pick_multiple_seeds(sub_gdf, len(leaders))

    assigned = {}
    frontiers = {}
    allocated = {l: 0 for l in leaders}

    for lid, sid in zip(leaders, seed_ids):
        assigned[sid] = lid
        frontiers[lid] = deque([sid])
        allocated[lid] += 1

    def get_local_neighbors(idx):
        geom = sub_gdf.loc[idx].geometry
        candidates = list(geom_idx.intersection(geom.bounds))
        return [i for i in candidates if i != idx and i not in assigned and geom.touches(sub_gdf.loc[i].geometry)]

    active = set(leaders)
    while active:
        for lid in list(active):
            frontier = frontiers[lid]
            if not frontier:
                active.remove(lid)
                continue
            current = frontier.popleft()
            neighbors = get_local_neighbors(current)
            for nbr in neighbors:
                if nbr in assigned:
                    continue
                assigned[nbr] = lid
                allocated[lid] += 1
                frontier.append(nbr)
                if allocated[lid] >= target_cells:
                    active.remove(lid)
                    break

    id_to_leader = {sub_gdf.loc[i, 'orig_id']: lid for i, lid in assigned.items()}
    gdf.loc[gdf.partner == partner, 'leader'] = gdf[gdf.partner == partner].index.map(id_to_leader).fillna("Unassigned")

# === Export or visualize ===
gdf.to_file("kharkiv_mine_risk_leader_partitioned.json", driver='GeoJSON')
