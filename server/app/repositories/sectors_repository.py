from .base_repository import BaseRepository
from app.models import Sector
from app.dtos import SectorCreate
from uuid import UUID
from sqlalchemy import func, select
from geoalchemy2 import Geography
from geoalchemy2.shape import from_shape
from shapely.geometry import shape


class SectorsRepository(BaseRepository):
    def __init__(self):
        super().__init__(Sector)

    def create_sector(self, sector_data: SectorCreate) -> Sector:
        """
        Creates a new sector from a SectorCreate DTO, calculating the area
        from the provided GeoJSON before insertion.

        This method prioritizes using the base repository's `insert_one` method.

        :param sector_data: A SectorCreate DTO containing the sector's details.
        :return: The newly created Sector ORM object.
        """
        # Convert the GeoJSON dictionary from the DTO into a Shapely geometry object
        shapely_geom = shape(sector_data.geometry)

        # Create a WKTElement that SQLAlchemy can use, with the correct SRID (4326)
        wkt_element = from_shape(shapely_geom, srid=4326)

        # --- Area Calculation ---
        # Execute a specific database function to calculate the area accurately.
        # We cast to 'geography' to get the result in square meters.
        # This is not a query on the model, but a necessary prerequisite calculation.
        area_calculation_statement = select(func.ST_Area(wkt_element.cast(Geography)))
        area_in_sq_meters = self.db.execute(area_calculation_statement).scalar_one()

        # Prepare the full record for insertion using the base repository
        record_to_insert = sector_data.model_dump(exclude={"geometry"})
        record_to_insert["geometry"] = wkt_element
        record_to_insert["area_sqm"] = area_in_sq_meters

        # Use the base repository's method to insert the new record
        return self.insert_one(record_to_insert)
