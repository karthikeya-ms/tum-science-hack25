from .base_repository import BaseRepository
from app.models import Sector
from app.dtos import SectorCreate, SectorResponse
from app.services.sector_services import coordinates_to_wkt, calculate_area_sqm
from app.enums import SectorStatus
from uuid import UUID
from typing import List, Optional
from geoalchemy2.elements import WKBElement
from geoalchemy2.shape import to_shape
import json


class SectorsRepository(BaseRepository):
    def __init__(self):
        super().__init__(Sector)

    def _convert_geometry_to_geojson(self, wkb_element):
        """
        Convert PostGIS WKBElement to GeoJSON dictionary format.
        """
        try:
            if isinstance(wkb_element, dict):
                return wkb_element

            if isinstance(wkb_element, WKBElement):
                # Convert WKBElement to Shapely geometry
                shapely_geom = to_shape(wkb_element)
                # Convert Shapely geometry to GeoJSON
                geojson = json.loads(json.dumps(shapely_geom.__geo_interface__))
                return geojson

        except Exception as e:
            print(f"Error converting WKB to GeoJSON: {e}")
            return {
                "type": "Polygon",
                "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            }

        return wkb_element

    def _sector_to_response(self, sector: Sector) -> SectorResponse:
        """
        Convert a Sector model to SectorResponse DTO with proper geometry conversion.
        """
        # Convert the sector to dict and fix geometry
        sector_dict = {
            "id": sector.id,
            "geometry": self._convert_geometry_to_geojson(sector.geometry),
            "area_sqm": sector.area_sqm,
            "risk_probability": sector.risk_probability,
            "total_mines_found": sector.total_mines_found,
            "status": sector.status,
            "created_at": sector.created_at,
            "updated_at": sector.updated_at,
            "assigned_ngo": sector.assigned_ngo,
            "assigned_team_lead": sector.assigned_team_lead,
            "assigned_operator": sector.assigned_operator,
        }
        return SectorResponse.model_validate(sector_dict)

    def _sectors_to_response_list(self, sectors: List[Sector]) -> List[SectorResponse]:
        """
        Convert a list of Sector models to SectorResponse DTOs.
        """
        response_data = []
        for sector in sectors:
            try:
                response_data.append(self._sector_to_response(sector))
            except Exception as e:
                print(f"Error converting sector {sector.id}: {e}")
        return response_data

    def create_sector(self, sector_data: SectorCreate) -> SectorResponse:
        """
        Creates a new sector from a SectorCreate DTO, calculating the area
        from the provided GeoJSON before insertion.

        :param sector_data: A SectorCreate DTO containing the sector's details.
        :return: The newly created SectorResponse DTO.
        """
        # Extract coordinates from the GeoJSON geometry
        coordinates = sector_data.geometry.get("coordinates", [])

        # Use service functions for geometry conversion and area calculation
        wkt_element = coordinates_to_wkt(coordinates)
        if wkt_element is None:
            raise ValueError("Failed to convert geometry to WKT format")

        area_in_sq_meters = calculate_area_sqm(coordinates)

        # Prepare the full record for insertion using the base repository
        record_to_insert = sector_data.model_dump(exclude={"geometry"})
        record_to_insert["geometry"] = wkt_element
        record_to_insert["area_sqm"] = area_in_sq_meters

        # Use the base repository's method to insert the new record
        sector = self.insert_one(record_to_insert)
        return self._sector_to_response(sector)

    def get_sectors_by_status(self, status: SectorStatus) -> List[SectorResponse]:
        """
        Get all sectors with a specific status.

        :param status: The SectorStatus to filter by
        :return: List of SectorResponse DTOs with the specified status
        """
        sectors = self.find_many(status=status)
        return self._sectors_to_response_list(sectors)

    def get_sectors_by_ngo(self, ngo_id: UUID) -> List[SectorResponse]:
        """
        Get all sectors assigned to a specific NGO.

        :param ngo_id: The UUID of the NGO user
        :return: List of SectorResponse DTOs assigned to the NGO
        """
        sectors = self.find_many(assigned_to_ngo_id=str(ngo_id))
        return self._sectors_to_response_list(sectors)

    def get_sectors_by_team_lead(self, team_lead_id: UUID) -> List[SectorResponse]:
        """
        Get all sectors assigned to a specific Team Lead.

        :param team_lead_id: The UUID of the Team Lead user
        :return: List of SectorResponse DTOs assigned to the Team Lead
        """
        sectors = self.find_many(assigned_to_team_lead_id=str(team_lead_id))
        return self._sectors_to_response_list(sectors)

    def get_sectors_by_operator(self, operator_id: UUID) -> List[SectorResponse]:
        """
        Get all sectors assigned to a specific Operator.

        :param operator_id: The UUID of the Operator user
        :return: List of SectorResponse DTOs assigned to the Operator
        """
        sectors = self.find_many(assigned_to_operator_id=str(operator_id))
        return self._sectors_to_response_list(sectors)

    def get_all_sectors(self) -> List[SectorResponse]:
        """
        Get all sectors.

        :return: List of all SectorResponse DTOs
        """
        sectors = self.find_many()
        return self._sectors_to_response_list(sectors)

    def get_sector_by_id(self, sector_id: UUID) -> Optional[SectorResponse]:
        """
        Get a sector by ID.

        :param sector_id: The UUID of the sector
        :return: SectorResponse DTO or None if not found
        """
        sector = self.find_one_by_id(str(sector_id))
        if not sector:
            return None
        return self._sector_to_response(sector)

    def assign_sector_to_ngo(
        self, sector_id: UUID, ngo_id: UUID
    ) -> Optional[SectorResponse]:
        """
        Assign a sector to an NGO.

        :param sector_id: The UUID of the sector to assign
        :param ngo_id: The UUID of the NGO user
        :return: The updated SectorResponse DTO or None if not found
        """
        sector = self.update_one_by_id(
            str(sector_id), {"assigned_to_ngo_id": str(ngo_id)}
        )
        if not sector:
            return None
        return self._sector_to_response(sector)

    def assign_sector_to_team_lead(
        self, sector_id: UUID, team_lead_id: UUID
    ) -> Optional[SectorResponse]:
        """
        Assign a sector to a Team Lead.

        :param sector_id: The UUID of the sector to assign
        :param team_lead_id: The UUID of the Team Lead user
        :return: The updated SectorResponse DTO or None if not found
        """
        sector = self.update_one_by_id(
            str(sector_id), {"assigned_to_team_lead_id": str(team_lead_id)}
        )
        if not sector:
            return None
        return self._sector_to_response(sector)

    def assign_sector_to_operator(
        self, sector_id: UUID, operator_id: UUID
    ) -> Optional[SectorResponse]:
        """
        Assign a sector to an Operator.

        :param sector_id: The UUID of the sector to assign
        :param operator_id: The UUID of the Operator user
        :return: The updated SectorResponse DTO or None if not found
        """
        sector = self.update_one_by_id(
            str(sector_id), {"assigned_to_operator_id": str(operator_id)}
        )
        if not sector:
            return None
        return self._sector_to_response(sector)

    def update_sector_status(
        self, sector_id: UUID, status: SectorStatus
    ) -> Optional[SectorResponse]:
        """
        Update the status of a sector.

        :param sector_id: The UUID of the sector to update
        :param status: The new SectorStatus
        :return: The updated SectorResponse DTO or None if not found
        """
        sector = self.update_one_by_id(str(sector_id), {"status": status})
        if not sector:
            return None
        return self._sector_to_response(sector)

    def get_unassigned_ngo_sectors(self) -> List[SectorResponse]:
        """
        Get sectors that are not assigned to any NGO.

        :return: List of SectorResponse DTOs without NGO assignment
        """
        sectors = (
            self.db.query(Sector).filter(Sector.assigned_to_ngo_id.is_(None)).all()
        )
        return self._sectors_to_response_list(sectors)

    def get_unassigned_team_lead_sectors(self) -> List[SectorResponse]:
        """
        Get sectors that are not assigned to any Team Lead.

        :return: List of SectorResponse DTOs without Team Lead assignment
        """
        sectors = (
            self.db.query(Sector)
            .filter(Sector.assigned_to_team_lead_id.is_(None))
            .all()
        )
        return self._sectors_to_response_list(sectors)

    def get_unassigned_operator_sectors(self) -> List[SectorResponse]:
        """
        Get sectors that are not assigned to any Operator.

        :return: List of SectorResponse DTOs without Operator assignment
        """
        sectors = (
            self.db.query(Sector).filter(Sector.assigned_to_operator_id.is_(None)).all()
        )
        return self._sectors_to_response_list(sectors)

    def get_completely_unassigned_sectors(self) -> List[SectorResponse]:
        """
        Get sectors that are not assigned to any user (NGO, Team Lead, or Operator).

        :return: List of completely unassigned SectorResponse DTOs
        """
        sectors = (
            self.db.query(Sector)
            .filter(
                Sector.assigned_to_ngo_id.is_(None),
                Sector.assigned_to_team_lead_id.is_(None),
                Sector.assigned_to_operator_id.is_(None),
            )
            .all()
        )
        return self._sectors_to_response_list(sectors)

    def get_sectors_with_assignments(self) -> List[SectorResponse]:
        """
        Get all sectors with their assigned users loaded.

        :return: List of SectorResponse DTOs with relationships loaded
        """
        from sqlalchemy.orm import joinedload

        sectors = (
            self.db.query(Sector)
            .options(
                joinedload(Sector.assigned_ngo),
                joinedload(Sector.assigned_team_lead),
                joinedload(Sector.assigned_operator),
            )
            .all()
        )
        return self._sectors_to_response_list(sectors)
