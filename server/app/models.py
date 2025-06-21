from sqlalchemy import (
    Column,
    String,
    Enum,
    Float,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)

from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from uuid import uuid4

from geoalchemy2 import Geometry
from geoalchemy2.elements import WKTElement

from app.database import CustomBase
from app.enums import UserRole, UserStatus, SectorStatus

Base = declarative_base(cls=CustomBase)


def generate_uuid():
    return str(uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    userName = Column(String, nullable=True)
    email = Column(String(254), nullable=True, unique=True, index=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.OPERATOR)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.ACTIVE)
    parent_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Relationships
    parent_user = relationship(  # Added missing space here
        "User", remote_side=[id], backref="subordinates", foreign_keys=[parent_user_id]
    )

    assigned_ngo_sectors = relationship(
        "Sector",
        foreign_keys="Sector.assigned_to_ngo_id",  # Changed from assigned_ngo_id to assigned_to_ngo_id
        back_populates="assigned_ngo",
    )

    assigned_team_lead_sectors = relationship(
        "Sector",
        foreign_keys="Sector.assigned_to_team_lead_id",
        back_populates="assigned_team_lead",
    )
    assigned_operator_sectors = relationship(
        "Sector",
        foreign_keys="Sector.assigned_to_operator_id",
        back_populates="assigned_operator",
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.userName}', role='{self.role.value}')>"


class Sector(Base):
    __tablename__ = "sectors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    geometry = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=False)
    area_sqm = Column(Float, nullable=False)
    risk_probability = Column(Float, nullable=False, default=0.0)
    total_mines_found = Column(Integer, nullable=False, default=0)
    status = Column(Enum(SectorStatus), nullable=False, default=SectorStatus.MINED)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    # --- Assignment Columns ---
    # An NGO user assigned to this sector
    assigned_to_ngo_id = Column(
        String(36),
        ForeignKey("users.id"),  # Ensure this FK targets a user with role 'NGO'
        nullable=True,
    )
    assigned_ngo = relationship(
        "User", foreign_keys=[assigned_to_ngo_id], back_populates="assigned_ngo_sectors"
    )

    # A Team Lead user assigned to this sector
    assigned_to_team_lead_id = Column(
        String(36),
        ForeignKey("users.id"),  # Ensure this FK targets a user with role 'Team Lead'
        nullable=True,
    )
    assigned_team_lead = relationship(
        "User",
        foreign_keys=[assigned_to_team_lead_id],
        back_populates="assigned_team_lead_sectors",
    )

    # An Operator user assigned to this sector
    assigned_to_operator_id = Column(
        String(36),
        ForeignKey("users.id"),  # Ensure this FK targets a user with role 'Operator'
        nullable=True,
    )
    assigned_operator = relationship(
        "User",
        foreign_keys=[assigned_to_operator_id],
        back_populates="assigned_operator_sectors",
    )

    def __repr__(self):
        ngo_name = (
            self.assigned_ngo.userName if self.assigned_ngo else "None"
        )  # Changed from username to userName
        team_lead_name = (
            self.assigned_team_lead.userName if self.assigned_team_lead else "None"
        )  # Changed from username to userName
        operator_name = (
            self.assigned_operator.userName if self.assigned_operator else "None"
        )  # Changed from username to userName
        return (
            f"<Sector(id={self.id}, "
            f"status='{self.status.name if self.status else None}', "  # Changed from current_status to status
            f"assigned_to_ngo='{ngo_name}', "
            f"assigned_to_team_lead='{team_lead_name}', "
            f"assigned_to_operator='{operator_name}')>"
        )
