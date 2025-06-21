import json
import os
from sqlalchemy.orm import sessionmaker
from geoalchemy2.elements import WKTElement
from shapely.geometry import Polygon
from shapely import wkt
from pyproj import Geod

from app.database import engine
from app.models import Sector
from app.enums import SectorStatus


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


def seed_sectors():
    """
    Read the first 5 features from sectors.json and populate the sector table.
    """
    print("--- Seeding Sectors Table ---")
    
    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Path to the sectors.json file
        sectors_file_path = os.path.join("app", "files", "sectors.json")
        
        if not os.path.exists(sectors_file_path):
            print(f"Error: {sectors_file_path} not found!")
            return
        
        print(f"Reading sectors data from: {sectors_file_path}")
        
        # Read the JSON file
        with open(sectors_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        if 'features' not in data:
            print("Error: 'features' key not found in JSON data!")
            return
        
        features = data['features']
        print(f"Total features in file: {len(features)}")
        
        # Take only the first 5 features
        features_to_seed = features[:]
        print(f"Seeding first {len(features_to_seed)} features...")
        
        # Clear existing sectors (optional - remove if you want to keep existing data)
        print("Clearing existing sectors...")
        session.query(Sector).delete()
        session.commit()
        
        # Process each feature
        for i, feature in enumerate(features_to_seed, 1):
            try:
                properties = feature.get('properties', {})
                geometry = feature.get('geometry', {})
                
                if geometry.get('type') != 'Polygon':
                    print(f"Skipping feature {i}: Not a polygon")
                    continue
                
                coordinates = geometry.get('coordinates', [])
                if not coordinates:
                    print(f"Skipping feature {i}: No coordinates")
                    continue
                
                # Extract properties
                risk = properties.get('risk', 0.0)
                if risk == 0.0:
                    sector_status = SectorStatus.CLEAR
                else:
                    sector_status = SectorStatus.PROBABLE
                
                # Convert coordinates to WKT
                wkt_geometry = coordinates_to_wkt(coordinates)
                if wkt_geometry is None:
                    print(f"Skipping feature {i}: Failed to convert geometry")
                    continue
                
                # Calculate area
                area_sqm = calculate_area_sqm(coordinates)
                
                # Create sector record
                sector = Sector(
                    geometry=wkt_geometry,
                    area_sqm=area_sqm,
                    risk_probability=risk,
                    total_mines_found=0,  # Default value
                    status=sector_status,  # Default status
                    # Assignment fields are left as None (nullable)
                )
                
                session.add(sector)
                print(f"Added sector {i}: Risk={risk}, Status={sector_status} Area={area_sqm:.2f} sqm")
                
            except Exception as e:
                print(f"Error processing feature {i}: {e}")
                continue
        
        # Commit all changes
        session.commit()
        print("Successfully seeded sectors table!")
        
        # Verify the data
        sector_count = session.query(Sector).count()
        print(f"Total sectors in database: {sector_count}")
        
    except Exception as e:
        print(f"Error during seeding: {e}")
        session.rollback()
    finally:
        session.close()
        print("-----------------------------")


if __name__ == "__main__":
    # This allows the script to be run directly from the command line.
    # Execute from within the 'server' directory: `python seed_sectors.py`
    seed_sectors() 