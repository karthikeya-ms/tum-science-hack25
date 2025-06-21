import geopandas as gpd
import numpy as np
import random
from shapely.geometry import Point, box
from shapely.ops import unary_union
import matplotlib
matplotlib.use("Agg")  # headless backend for PNG export
import matplotlib.pyplot as plt
from rtree import index as rtree_index
from collections import deque
import io


def _build_gdf(ua_geojson_path: str = "ua.json") -> gpd.GeoDataFrame:
    """
    Builds and returns a GeoDataFrame with columns:
    - geometry: grid cell polygons
    - risk: float risk value
    - partner: assigned partner code (A/B/C) or "Unassigned"
    """
    # === Step 1: Load Ukraine boundary ===
    ukraine = gpd.read_file(ua_geojson_path).to_crs("EPSG:4326")

    # === Step 2: Define Kharkiv region (100 km radius) ===
    center_lat, center_lon = 49.988, 36.232
    radius_deg = 100 / 111  # approx degrees per 100 km
    kharkiv_region = Point(center_lon, center_lat).buffer(radius_deg)

    # === Step 3: Generate risk "blobs" inside region ===
    blob_radius_deg = (7 / 111)
    target_area_km2 = 31000
    num_blobs = int(target_area_km2 / (np.pi * 7**2))
    minx, miny, maxx, maxy = kharkiv_region.bounds

    blobs = []
    while len(blobs) < num_blobs:
        x = random.uniform(minx, maxx)
        y = random.uniform(miny, maxy)
        p = Point(x, y)
        if kharkiv_region.contains(p):
            blobs.append(p.buffer(blob_radius_deg))
    mine_zone = unary_union(blobs)

    # === Step 4: Discretize mine zone into ~1 km² grid cells ===
    resolution = 0.01  # ~1 km
    minx, miny, maxx, maxy = mine_zone.bounds
    cells = []
    x = minx
    while x < maxx:
        y = miny
        while y < maxy:
            cell = box(x, y, x + resolution, y + resolution)
            risk = random.gauss(0.5, 0.2) if mine_zone.contains(cell) else 0
            risk = float(max(0, min(1, risk)))
            cells.append({
                'geometry': cell,
                'risk': risk
            })
            y += resolution
        x += resolution

    mine_risk_gdf = gpd.GeoDataFrame(cells, crs="EPSG:4326")
    # Clip to Ukraine boundary
    mine_risk_gdf = gpd.overlay(mine_risk_gdf, ukraine, how="intersection")
    gdf = mine_risk_gdf.copy()

    # === Step 5: Partition cells among partners via flood-fill ===
    partners = { 'A': 10000, 'B': 7000, 'C': 3000 }
    total = sum(partners.values())
    partners = {k: v / total for k, v in partners.items()}

    total_risk = gdf['risk'].sum()
    targets = {p: total_risk * share for p, share in partners.items()}
    allocated = {p: 0.0 for p in partners}

    # Build spatial index
    gdf['id'] = gdf.index
    gdf['centroid'] = gdf.geometry.centroid
    idx = rtree_index.Index()
    for i, geom in enumerate(gdf.geometry):
        idx.insert(i, geom.bounds)

    # Seed selection
    def pick_seed(existing_ids):
        if not existing_ids:
            return gdf.loc[gdf.centroid.y.idxmin()]
        used = gdf.loc[list(existing_ids)].centroid.to_numpy()
        allc = gdf.centroid.to_numpy()
        best, maxd = None, -1
        for i, c in enumerate(allc):
            if i in existing_ids: continue
            d = min(np.linalg.norm(np.array(c.coords[0]) - np.array(u.coords[0])) for u in used)
            if d > maxd:
                maxd, best = d, i
        return gdf.loc[best]

    assigned = {}
    frontiers = {}
    used_ids = set()

    for p in partners:
        seed = pick_seed(used_ids)
        sid = seed['id']
        frontiers[p] = deque([sid])
        assigned[sid] = p
        allocated[p] += gdf.loc[sid, 'risk']
        used_ids.add(sid)

    # Neighbor finder
    def neighbors(cell_id):
        geom = gdf.loc[cell_id].geometry
        for nbr in idx.intersection(geom.bounds):
            if nbr not in assigned and geom.touches(gdf.loc[nbr].geometry):
                yield nbr

    # Flood-fill allocation
    active = set(partners.keys())
    while active:
        for p in list(active):
            if not frontiers[p]:
                active.remove(p)
                continue
            current = frontiers[p].popleft()
            for nbr in neighbors(current):
                if nbr in assigned: continue
                assigned[nbr] = p
                allocated[p] += gdf.loc[nbr, 'risk']
                frontiers[p].append(nbr)
                if allocated[p] >= targets[p]:
                    active.remove(p)
                    break

    gdf['partner'] = gdf['id'].map(assigned).fillna("Unassigned")
    return gdf


def _plot_gdf(gdf, ua_geojson_path: str):
    # Plot categorical partner allocation
    plot_gdf = gdf[gdf['partner'] != 'Unassigned']
    fig, ax = plt.subplots(figsize=(8, 8))
    plot_gdf.plot(
        column='partner',
        categorical=True,
        legend=True,
        ax=ax,
        cmap='tab20',
        linewidth=0,
        markersize=1,
    )
    # Overlay Ukraine border
    ukraine = gpd.read_file(ua_geojson_path).to_crs('EPSG:4326')
    ukraine.boundary.plot(ax=ax, edgecolor='black', linewidth=1)
    ax.set_axis_off()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=150)
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def generate_risk_map(ua_geojson_path: str = 'ua.json') -> bytes:
    """Generate full map for all partners."""
    gdf = _build_gdf(ua_geojson_path)
    return _plot_gdf(gdf, ua_geojson_path)


def generate_risk_map_for_partner(ua_geojson_path: str = 'ua.json', partner: str = 'A') -> bytes:
    """Generate map only for a specific partner."""
    gdf = _build_gdf(ua_geojson_path)
    slice_gdf = gdf[gdf['partner'] == partner]
    return _plot_gdf(slice_gdf, ua_geojson_path)
