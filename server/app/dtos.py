from pydantic import BaseModel, Field
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

from app.enums import SectorStatus, UserRole, UserStatus


class HelloWorldResponse(BaseModel):
    message: str


class SectorCreate(BaseModel):
    """
    DTO for creating a new sector.
    The geometry should be a valid GeoJSON Polygon.
    """

    geometry: dict[str, Any] = Field(
        ...,
        description="A GeoJSON object representing the sector's polygon.",
        examples=[
            {
                "type": "Polygon",
                "coordinates": [
                    [
                        [10.0, 10.0],
                        [10.1, 10.0],
                        [10.1, 10.1],
                        [10.0, 10.1],
                        [10.0, 10.0],
                    ]
                ],
            }
        ],
    )
    status: Optional[SectorStatus] = Field(
        default=SectorStatus.CLEAR, description="The initial status of the sector."
    )
    risk_probability: Optional[float] = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="The initial risk probability for the sector (between 0.0 and 1.0).",
    )
    assigned_to_ngo_id: Optional[UUID] = Field(
        default=None, description="Optional: The ID of the NGO to assign this sector to."
    )
    assigned_to_team_lead_id: Optional[UUID] = Field(
        default=None,
        description="Optional: The ID of the Team Lead to assign this sector to.",
    )
    assigned_to_operator_id: Optional[UUID] = Field(
        default=None,
        description="Optional: The ID of the Operator to assign this sector to.",
    )

    class Config:
        # This allows the model to be used with ORM objects and enables enum values
        from_attributes = True
        use_enum_values = True


class UserResponse(BaseModel):
    """
    DTO for returning user information.
    """

    id: UUID
    userName: Optional[str] = None
    email: Optional[str] = None
    role: UserRole
    status: UserStatus
    parent_user_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        use_enum_values = True


class SectorResponse(BaseModel):
    """
    DTO for returning sector information, including nested user details.
    """

    id: UUID
    geometry: dict[str, Any]
    area_sqm: float
    risk_probability: float
    total_mines_found: int
    status: SectorStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    # Nested response models for assigned users
    assigned_ngo: Optional[UserResponse] = None
    assigned_team_lead: Optional[UserResponse] = None
    assigned_operator: Optional[UserResponse] = None

    class Config:
        from_attributes = True
        use_enum_values = True
