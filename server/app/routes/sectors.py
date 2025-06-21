from fastapi import APIRouter
from typing import List
from uuid import UUID

from app.repositories.sectors_repository import SectorsRepository
from app.dtos import SectorCreate, SectorResponse
from app.enums import SectorStatus
from app.core.custom_exceptions import (
    ResourceNotFoundException,
    InternalServerErrorException,
    BadDataException,
)

router = APIRouter(prefix="/sectors", tags=["sectors"])


@router.post("/", response_model=SectorResponse, status_code=201)
def create_sector(sector_data: SectorCreate) -> SectorResponse:
    """Create a new sector."""
    try:
        repo = SectorsRepository()
        return repo.create_sector(sector_data)
    except ValueError as e:
        # Handle specific validation errors from geometry conversion
        raise BadDataException(str(e))
    except Exception as e:
        print(f"Error in create_sector: {e}")
        raise InternalServerErrorException(f"Failed to create sector: {str(e)}")


@router.get("/", response_model=List[SectorResponse])
def get_all_sectors() -> List[SectorResponse]:
    """Get all sectors."""
    try:
        repo = SectorsRepository()
        return repo.get_all_sectors()
    except Exception as e:
        print(f"Error in get_all_sectors: {e}")
        raise InternalServerErrorException(f"Failed to retrieve sectors: {str(e)}")


@router.get("/{sector_id}", response_model=SectorResponse)
def get_sector_by_id(sector_id: UUID) -> SectorResponse:
    """Get a sector by ID."""
    try:
        repo = SectorsRepository()
        sector = repo.get_sector_by_id(sector_id)
        if not sector:
            raise ResourceNotFoundException("Sector not found")
        return sector
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in get_sector_by_id: {e}")
        raise InternalServerErrorException(f"Failed to retrieve sector: {str(e)}")


@router.get("/status/{status}", response_model=List[SectorResponse])
def get_sectors_by_status(status: SectorStatus) -> List[SectorResponse]:
    """Get all sectors with a specific status."""
    try:
        repo = SectorsRepository()
        return repo.get_sectors_by_status(status)
    except Exception as e:
        print(f"Error in get_sectors_by_status: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve sectors by status: {str(e)}"
        )


@router.get("/ngo/{ngo_id}", response_model=List[SectorResponse])
def get_sectors_by_ngo(ngo_id: UUID) -> List[SectorResponse]:
    """Get all sectors assigned to a specific NGO."""
    try:
        repo = SectorsRepository()
        return repo.get_sectors_by_ngo(ngo_id)
    except Exception as e:
        print(f"Error in get_sectors_by_ngo: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve sectors by NGO: {str(e)}"
        )


@router.get("/team-lead/{team_lead_id}", response_model=List[SectorResponse])
def get_sectors_by_team_lead(team_lead_id: UUID) -> List[SectorResponse]:
    """Get all sectors assigned to a specific Team Lead."""
    try:
        repo = SectorsRepository()
        return repo.get_sectors_by_team_lead(team_lead_id)
    except Exception as e:
        print(f"Error in get_sectors_by_team_lead: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve sectors by Team Lead: {str(e)}"
        )


@router.get("/operator/{operator_id}", response_model=List[SectorResponse])
def get_sectors_by_operator(operator_id: UUID) -> List[SectorResponse]:
    """Get all sectors assigned to a specific Operator."""
    try:
        repo = SectorsRepository()
        return repo.get_sectors_by_operator(operator_id)
    except Exception as e:
        print(f"Error in get_sectors_by_operator: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve sectors by Operator: {str(e)}"
        )


@router.get("/unassigned/ngo", response_model=List[SectorResponse])
def get_unassigned_ngo_sectors() -> List[SectorResponse]:
    """Get sectors that are not assigned to any NGO."""
    try:
        repo = SectorsRepository()
        return repo.get_unassigned_ngo_sectors()
    except Exception as e:
        print(f"Error in get_unassigned_ngo_sectors: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve unassigned NGO sectors: {str(e)}"
        )


@router.get("/unassigned/team-lead", response_model=List[SectorResponse])
def get_unassigned_team_lead_sectors() -> List[SectorResponse]:
    """Get sectors that are not assigned to any Team Lead."""
    try:
        repo = SectorsRepository()
        return repo.get_unassigned_team_lead_sectors()
    except Exception as e:
        print(f"Error in get_unassigned_team_lead_sectors: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve unassigned Team Lead sectors: {str(e)}"
        )


@router.get("/unassigned/operator", response_model=List[SectorResponse])
def get_unassigned_operator_sectors() -> List[SectorResponse]:
    """Get sectors that are not assigned to any Operator."""
    try:
        repo = SectorsRepository()
        return repo.get_unassigned_operator_sectors()
    except Exception as e:
        print(f"Error in get_unassigned_operator_sectors: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve unassigned Operator sectors: {str(e)}"
        )


@router.get("/unassigned/all", response_model=List[SectorResponse])
def get_completely_unassigned_sectors() -> List[SectorResponse]:
    """Get sectors that are not assigned to any user (NGO, Team Lead, or Operator)."""
    try:
        repo = SectorsRepository()
        return repo.get_completely_unassigned_sectors()
    except Exception as e:
        print(f"Error in get_completely_unassigned_sectors: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve completely unassigned sectors: {str(e)}"
        )


@router.get("/with-assignments", response_model=List[SectorResponse])
def get_sectors_with_assignments() -> List[SectorResponse]:
    """Get all sectors with their assigned users loaded."""
    try:
        repo = SectorsRepository()
        return repo.get_sectors_with_assignments()
    except Exception as e:
        print(f"Error in get_sectors_with_assignments: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve sectors with assignments: {str(e)}"
        )


@router.put("/{sector_id}/assign/ngo/{ngo_id}", response_model=SectorResponse)
def assign_sector_to_ngo(sector_id: UUID, ngo_id: UUID) -> SectorResponse:
    """Assign a sector to an NGO."""
    try:
        repo = SectorsRepository()
        sector = repo.assign_sector_to_ngo(sector_id, ngo_id)
        if not sector:
            raise ResourceNotFoundException("Sector not found")
        return sector
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in assign_sector_to_ngo: {e}")
        raise InternalServerErrorException(f"Failed to assign sector to NGO: {str(e)}")


@router.put(
    "/{sector_id}/assign/team-lead/{team_lead_id}", response_model=SectorResponse
)
def assign_sector_to_team_lead(sector_id: UUID, team_lead_id: UUID) -> SectorResponse:
    """Assign a sector to a Team Lead."""
    try:
        repo = SectorsRepository()
        sector = repo.assign_sector_to_team_lead(sector_id, team_lead_id)
        if not sector:
            raise ResourceNotFoundException("Sector not found")
        return sector
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in assign_sector_to_team_lead: {e}")
        raise InternalServerErrorException(
            f"Failed to assign sector to Team Lead: {str(e)}"
        )


@router.put("/{sector_id}/assign/operator/{operator_id}", response_model=SectorResponse)
def assign_sector_to_operator(sector_id: UUID, operator_id: UUID) -> SectorResponse:
    """Assign a sector to an Operator."""
    try:
        repo = SectorsRepository()
        sector = repo.assign_sector_to_operator(sector_id, operator_id)
        if not sector:
            raise ResourceNotFoundException("Sector not found")
        return sector
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in assign_sector_to_operator: {e}")
        raise InternalServerErrorException(
            f"Failed to assign sector to Operator: {str(e)}"
        )


@router.put("/{sector_id}/status/{status}", response_model=SectorResponse)
def update_sector_status(sector_id: UUID, status: SectorStatus) -> SectorResponse:
    """Update the status of a sector."""
    try:
        repo = SectorsRepository()
        sector = repo.update_sector_status(sector_id, status)
        if not sector:
            raise ResourceNotFoundException("Sector not found")
        return sector
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in update_sector_status: {e}")
        raise InternalServerErrorException(f"Failed to update sector status: {str(e)}")


@router.delete("/{sector_id}", status_code=204)
def delete_sector(sector_id: UUID):
    """Delete a sector."""
    try:
        repo = SectorsRepository()
        deleted_count = repo.delete_one(str(sector_id))
        if deleted_count == 0:
            raise ResourceNotFoundException("Sector not found")
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in delete_sector: {e}")
        raise InternalServerErrorException(f"Failed to delete sector: {str(e)}")
