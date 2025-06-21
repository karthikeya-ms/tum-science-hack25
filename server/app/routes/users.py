from fastapi import APIRouter
from typing import List, Optional
from uuid import UUID

from app.repositories.users_repository import UsersRepository
from app.dtos import UserResponse
from app.enums import UserRole, UserStatus
from app.core.custom_exceptions import (
    ResourceNotFoundException,
    InternalServerErrorException,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=List[UserResponse])
def get_all_users() -> List[UserResponse]:
    """Get all users."""
    try:
        repo = UsersRepository()
        return repo.get_all_users()
    except Exception as e:
        print(f"Error in get_all_users: {e}")
        raise InternalServerErrorException(f"Failed to retrieve users: {str(e)}")


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: UUID) -> UserResponse:
    """Get a user by ID."""
    try:
        repo = UsersRepository()
        user = repo.get_user_by_id(user_id)
        if not user:
            raise ResourceNotFoundException("User not found")
        return user
    except ResourceNotFoundException:
        raise  # Re-raise the custom exception
    except Exception as e:
        print(f"Error in get_user_by_id: {e}")
        raise InternalServerErrorException(f"Failed to retrieve user: {str(e)}")


@router.get("/role/{role}", response_model=List[UserResponse])
def get_users_by_role(role: UserRole) -> List[UserResponse]:
    """Get all users with a specific role."""
    try:
        repo = UsersRepository()
        return repo.get_users_by_role(role)
    except Exception as e:
        print(f"Error in get_users_by_role: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve users by role: {str(e)}"
        )


@router.get("/status/{status}", response_model=List[UserResponse])
def get_users_by_status(status: UserStatus) -> List[UserResponse]:
    """Get all users with a specific status."""
    try:
        repo = UsersRepository()
        return repo.get_users_by_status(status)
    except Exception as e:
        print(f"Error in get_users_by_status: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve users by status: {str(e)}"
        )


@router.get("/parent/{parent_user_id}", response_model=List[UserResponse])
def get_users_by_parent(parent_user_id: UUID) -> List[UserResponse]:
    """Get all users under a specific parent user."""
    try:
        repo = UsersRepository()
        return repo.get_users_by_parent(parent_user_id)
    except Exception as e:
        print(f"Error in get_users_by_parent: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve users by parent: {str(e)}"
        )


@router.get("/ngos/all", response_model=List[UserResponse])
def get_ngos() -> List[UserResponse]:
    """Get all NGO users."""
    try:
        repo = UsersRepository()
        return repo.get_ngos()
    except Exception as e:
        print(f"Error in get_ngos: {e}")
        raise InternalServerErrorException(f"Failed to retrieve NGO users: {str(e)}")


@router.get("/team-leads/all", response_model=List[UserResponse])
def get_team_leads(ngo_id: Optional[UUID] = None) -> List[UserResponse]:
    """Get all Team Lead users, optionally filtered by NGO."""
    try:
        repo = UsersRepository()
        return repo.get_team_leads(ngo_id)
    except Exception as e:
        print(f"Error in get_team_leads: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve Team Lead users: {str(e)}"
        )


@router.get("/operators/all", response_model=List[UserResponse])
def get_operators(team_lead_id: Optional[UUID] = None) -> List[UserResponse]:
    """Get all Operator users, optionally filtered by Team Lead."""
    try:
        repo = UsersRepository()
        return repo.get_operators(team_lead_id)
    except Exception as e:
        print(f"Error in get_operators: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve Operator users: {str(e)}"
        )


@router.get("/active/all", response_model=List[UserResponse])
def get_active_users() -> List[UserResponse]:
    """Get all active users."""
    try:
        repo = UsersRepository()
        return repo.get_active_users()
    except Exception as e:
        print(f"Error in get_active_users: {e}")
        raise InternalServerErrorException(f"Failed to retrieve active users: {str(e)}")


@router.get("/inactive/all", response_model=List[UserResponse])
def get_inactive_users() -> List[UserResponse]:
    """Get all inactive users."""
    try:
        repo = UsersRepository()
        return repo.get_inactive_users()
    except Exception as e:
        print(f"Error in get_inactive_users: {e}")
        raise InternalServerErrorException(
            f"Failed to retrieve inactive users: {str(e)}"
        )
