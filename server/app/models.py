from sqlalchemy import (
    Column,
    String,
)
from uuid import uuid4

from app.database import Base


def generate_uuid():
    return str(uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    firstName = Column(String, nullable=True)
    lastName = Column(String, nullable=True)
    email = Column(String(254), nullable=True, unique=True, index=True)
