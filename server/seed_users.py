import string
from sqlalchemy.orm import sessionmaker

from app.database import engine
from app.models import User
from app.repositories.users_repository import UsersRepository
from app.enums import UserRole
from app.enums import UserStatus


def seed_users():
    """
    Seed the database with initial user data.
    """
    print("--- Seeding Users Data ---")

    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()

    user_repository = UsersRepository()

    # Clear existing sectors (optional - remove if you want to keep existing data)
    print("Clearing existing sectors...")
    session.query(User).delete()
    session.commit()

    # user_repository.delete_many()

    # Gormint Aunty
    gormint_aunty = {
        "userName": "Ministry of Demining",
        "email": "Demining@gov.com",
        "role": UserRole.MINISTRY,
        "status": UserStatus.ACTIVE,
    }

    try:
        print("Adding Ministry...")
        gormint_aunty = user_repository.insert_one(gormint_aunty)
        print(f"Ministry added with ID: {gormint_aunty.id}")
        session.commit()
    except Exception as e:
        print(f"Error adding Gormint Aunty: {e}")
        session.rollback()

    maxTeamLeads = 4

    for letter in string.ascii_uppercase[:3]:
        # Create a user for each letter
        user_data = {
            "userName": f"{letter}",
            "email": f"{letter}@{letter}-NGO.com",
            "role": UserRole.NGO,
            "status": UserStatus.ACTIVE,
        }

        print(f"Adding NGO user {letter}...")
        try:
            NGO_user = user_repository.insert_one(user_data)
            print(f"NGO user {letter} added with ID: {NGO_user.id}")
            session.commit()
        except Exception as e:
            print(f"Error adding NGO user {letter}: {e}")
            session.rollback()

            for i in range(1, maxTeamLeads):
                user_data = {
                    "userName": f"{letter}{i}",
                    "email": f"{letter}{i}@{letter}-NGO.com",
                    "role": UserRole.TEAM_LEAD,
                    "status": UserStatus.ACTIVE,
                    "parent_user_id": NGO_user.id,
                }

                try:
                    print(f"Adding Team Lead user {letter}{i}...")
                    team_lead_user = user_repository.insert_one(user_data)
                    print(
                        f"Team Lead user {letter}{i} added with ID: {team_lead_user.id}"
                    )
                    session.commit()
                except Exception as e:
                    print(f"Error adding Team Lead user {letter}{i}: {e}")
                    session.rollback()

                for j in range(1, 4):
                    user_data = {
                        "userName": f"{letter}{i}{j}",
                        "email": f"{letter}{i}{j}@{letter}-NGO.com",
                        "role": UserRole.OPERATOR,
                        "status": UserStatus.ACTIVE,
                        "parent_user_id": team_lead_user.id,
                    }

                    try:
                        print(f"Adding Operator user {letter}{i}{j}...")
                        operator_user = user_repository.insert_one(user_data)
                        print(
                            f"Operator user {letter}{i}{j} added with ID: {operator_user.id}"
                        )
                        session.commit()
                    except Exception as e:
                        print(f"Error adding Operator user {letter}{i}{j}: {e}")
                        session.rollback()

            maxTeamLeads -= 1


if __name__ == "__main__":
    seed_users()
