import geopandas as gpd
import folium
import json
import branca.colormap as cm


# === Load Ukraine boundary and synthetic risk ===
ukraine = gpd.read_file("ua.json").to_crs("EPSG:4326")
mine_risk = gpd.read_file("synthetic_kharkiv_mine_risk.json").to_crs("EPSG:4326")

# === Create base map ===
center_lat = ukraine.geometry.centroid.y.mean()
center_lon = ukraine.geometry.centroid.x.mean()
m = folium.Map(location=[center_lat, center_lon], zoom_start=6, tiles="cartodbpositron")

# === Add Ukraine boundary ===
folium.GeoJson(
    ukraine,
    name="Ukraine Border",
    style_function=lambda x: {
        'fillColor': 'white',
        'color': 'black',
        'weight': 1,
        'fillOpacity': 0.1
    }
).add_to(m)

# === Create color map for risk levels ===
min_risk = mine_risk["risk"].min()
max_risk = mine_risk["risk"].max()
colormap = cm.linear.Reds_09.scale(min_risk, max_risk)
colormap.caption = 'Synthetic Mine Risk'
colormap.add_to(m)

# === Add mine risk overlay ===
def style_function(feature):
    risk = feature["properties"]["risk"]
    return {
        'fillColor': colormap(risk),
        'color': 'black',
        'weight': 0.2,
        'fillOpacity': 0.7,
    }

folium.GeoJson(
    data=json.loads(mine_risk.to_json()),
    name="Mine Risk Zones",
    style_function=style_function,
    tooltip=folium.GeoJsonTooltip(fields=["risk"], aliases=["Mine Risk"])
).add_to(m)

folium.LayerControl().add_to(m)
m.save("interactive_mine_risk_map.html")
print("✅ Interactive map saved as 'interactive_mine_risk_map.html'")
