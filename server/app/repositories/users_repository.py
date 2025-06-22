from .base_repository import BaseRepository
from app.models import User
from app.dtos import UserResponse
from app.enums import UserRole, UserStatus
from uuid import UUID
from typing import List, Optional


class UsersRepository(BaseRepository):
    def __init__(self):
        super().__init__(User)

    def _user_to_response(self, user: User) -> UserResponse:
        """
        Convert a User model to UserResponse DTO.
        """
        return UserResponse.model_validate(user)

    def _users_to_response_list(self, users: List[User]) -> List[UserResponse]:
        """
        Convert a list of User models to UserResponse DTOs.
        """
        response_data = []
        for user in users:
            try:
                response_data.append(self._user_to_response(user))
            except Exception as e:
                print(f"Error converting user {user.id}: {e}")
        return response_data

    def get_all_users(self) -> List[UserResponse]:
        """
        Get all users.

        :return: List of all UserResponse DTOs
        """
        users = self.find_many()
        return self._users_to_response_list(users)

    def get_user_by_id(self, user_id: UUID) -> Optional[UserResponse]:
        """
        Retrieves a user by their ID and returns a UserResponse DTO.

        :param user_id: The UUID of the user to retrieve.
        :return: A UserResponse DTO containing the user's details or None if not found.
        """
        user = self.find_one_by_id(str(user_id))
        if not user:
            return None
        return self._user_to_response(user)

    def get_users_by_role(self, role: UserRole) -> List[UserResponse]:
        """
        Get all users with a specific role.

        :param role: The UserRole to filter by
        :return: List of users with the specified role
        """
        users = self.find_many(role=role)
        return self._users_to_response_list(users)

    def get_users_by_status(self, status: UserStatus) -> List[UserResponse]:
        """
        Get all users with a specific status.

        :param status: The UserStatus to filter by
        :return: List of users with the specified status
        """
        users = self.find_many(status=status)
        return self._users_to_response_list(users)

    def get_users_by_parent(self, parent_user_id: UUID) -> List[UserResponse]:
        """
        Get all users with a specific parent user.

        :param parent_user_id: The UUID of the parent user
        :return: List of users under the specified parent
        """
        users = self.find_many(parent_user_id=str(parent_user_id))
        return self._users_to_response_list(users)

    def get_ngos(self) -> List[UserResponse]:
        """
        Get all NGO users.

        :return: List of NGO users
        """
        return self.get_users_by_role(UserRole.NGO)

    def get_user_by_username(self, username: str) -> List[Optional[UserResponse]]:
        """
        Retrieves a user by their username and returns a UserResponse DTO.

        :param username: The username of the user to retrieve.
        :return: A UserResponse DTO containing the user's details or None if not found.
        """
        user = self.find_many(userName=username)
        if not user:
            return None
        return self._users_to_response_list(user)

    def get_team_leads(self, ngo_id: Optional[UUID] = None) -> List[UserResponse]:
        """
        Get all Team Lead users, optionally filtered by NGO.

        :param ngo_id: Optional UUID of the NGO to filter by
        :return: List of Team Lead users
        """
        if ngo_id:
            return self.get_users_by_parent(ngo_id)
        else:
            return self.get_users_by_role(UserRole.TEAM_LEAD)

    def get_operators(self, team_lead_id: Optional[UUID] = None) -> List[UserResponse]:
        """
        Get all Operator users, optionally filtered by Team Lead.

        :param team_lead_id: Optional UUID of the Team Lead to filter by
        :return: List of Operator users
        """
        if team_lead_id:
            return self.get_users_by_parent(team_lead_id)
        else:
            return self.get_users_by_role(UserRole.OPERATOR)

    def get_active_users(self) -> List[UserResponse]:
        """
        Get all active users.

        :return: List of active users
        """
        return self.get_users_by_status(UserStatus.ACTIVE)

    def get_inactive_users(self) -> List[UserResponse]:
        """
        Get all inactive users.

        :return: List of inactive users
        """
        return self.get_users_by_status(UserStatus.INACTIVE)

    def create_user(self, user_data: dict) -> UserResponse:
        """
        Creates a new user from user data dictionary.

        :param user_data: A dictionary containing the user's details.
        :return: The newly created UserResponse DTO.
        """
        user = self.insert_one(user_data)
        return self._user_to_response(user)

    def update_user_status(
        self, user_id: UUID, status: UserStatus
    ) -> Optional[UserResponse]:
        """
        Update the status of a user.

        :param user_id: The UUID of the user to update
        :param status: The new UserStatus
        :return: The updated UserResponse DTO or None if not found
        """
        user = self.update_one_by_id(str(user_id), {"status": status})
        if not user:
            return None
        return self._user_to_response(user)

    def assign_parent(
        self, user_id: UUID, parent_user_id: UUID
    ) -> Optional[UserResponse]:
        """
        Assign a parent user to a user.

        :param user_id: The UUID of the user to assign parent to
        :param parent_user_id: The UUID of the parent user
        :return: The updated UserResponse DTO or None if not found
        """
        user = self.update_one_by_id(
            str(user_id), {"parent_user_id": str(parent_user_id)}
        )
        if not user:
            return None
        return self._user_to_response(user)
