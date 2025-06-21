from .base_repository import BaseRepository
from app.models import Sector
from uuid import UUID
class SectorsRepository(BaseRepository):
    def __init__(self):
        super().__init__(Sector)

    