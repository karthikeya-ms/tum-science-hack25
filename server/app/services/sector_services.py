from geoalchemy2.elements import WKTElement
from shapely.geometry import Polygon
from shapely import wkt
from pyproj import Geod


def calculate_area_sqm(coordinates):
    """
    Calculate the area of a polygon in square meters.
    Note: This is an approximation as it doesn't account for Earth's curvature.
    For more accurate calculations, consider using a proper geospatial library.
    """
    try:
        # Create a Shapely polygon from coordinates
        polygon = Polygon(coordinates[0])  # First ring is the exterior
        # Convert from degrees to approximate meters (very rough approximation)
        # 1 degree latitude ≈ 111,000 meters
        # 1 degree longitude varies by latitude, using average approximation
        geom = wkt.loads(polygon.wkt)
        geod = Geod(ellps="WGS84")

        area_sqm, _ = geod.geometry_area_perimeter(geom)
        # area_deg_sq = polygon.area
        # area_sqm = area_deg_sq * (111000 ** 2)  # Very rough approximation
        return area_sqm / 1e6  # Convert to square km
    except Exception as e:
        print(f"Error calculating area: {e}")
        return 0.0


def coordinates_to_wkt(coordinates):
    """
    Convert GeoJSON coordinates to WKT format for PostGIS.
    """
    try:
        # Extract the exterior ring coordinates
        exterior_coords = coordinates[0]

        # Format coordinates as WKT POLYGON
        coord_pairs = []
        for coord in exterior_coords:
            coord_pairs.append(f"{coord[0]} {coord[1]}")

        wkt_string = f"POLYGON(({', '.join(coord_pairs)}))"
        return WKTElement(wkt_string, srid=4326)
    except Exception as e:
        print(f"Error converting coordinates to WKT: {e}")
        return None
