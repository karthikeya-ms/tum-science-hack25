from .base_repository import BaseRepository
from app.models import User
from app.dtos import UserResponse

from uuid import UUID


class UsersRepository(BaseRepository):
    def __init__(self):
        super().__init__(User)

    def get_user_by_id(self, user_id: UUID) -> UserResponse:
        """
        Retrieves a user by their ID and returns a UserResponse DTO.

        :param user_id: The UUID of the user to retrieve.
        :return: A UserResponse DTO containing the user's details.
        """
        user = self.get_by_id(user_id)
        if not user:
            return None
        return UserResponse.model_validate(user)

    def create_user(self, user_data: UserResponse) -> UserResponse:
        """
        Creates a new user from a UserResponse DTO.

        :param user_data: A UserResponse DTO containing the user's details.
        :return: The newly created UserResponse DTO.
        """
        user = self.insert_one(user_data.model_dump())
        return UserResponse.model_validate(user)
