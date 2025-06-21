from sqlalchemy import (
    Column,
    String,
    Enum,
    Geometry,
    Polygon,
    Float,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
)
from uuid import uuid4

from app.database import Base
from app.enums import UserRole, UserStatus, SectorStatus


def generate_uuid():
    return str(uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    firstName = Column(String, nullable=True)
    lastName = Column(String, nullable=True)
    email = Column(String(254), nullable=True, unique=True, index=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.OPERATOR)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.ACTIVE)  
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class Sector(Base):
    __tablename__ = "sectors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    geometry = Column(Geometry(geometry_type="POLYGON", srid=4326, dimensions=2), nullable=False)
    area_sqm = Column(Float, nullable=False)
    total_mines_found = Column(Integer, nullable=False, default=0)
    status = Column(Enum(SectorStatus), nullable=False, default=SectorStatus.MINED)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
