from sqlalchemy.orm import sessionmaker

from app.database import engine
from app.models import User


def verify_users():
    """
    Print all users in the database.
    """
    print("--- Verifying Users Data ---")
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        users = session.query(User).all()
        print(f"Total users in database: {len(users)}")
        print("=" * 50)
        for i, user in enumerate(users, 1):
            print(f"User {i}:")
            print(f"  ID: {user.id}")
            print(f"  Name: {user.userName}")
            print(f"  Email: {user.email}")
            print(f"  Role: {user.role.value if user.role else 'None'}")
            print(f"  Status: {user.status.value if user.status else 'None'}")
            print(f"  Parent User ID: {user.parent_user_id}")
            print(f"  Created: {user.created_at}")
            print(f"  Updated: {user.updated_at}")
            print("-" * 30)
    except Exception as e:
        print(f"Error verifying users: {e}")
    finally:
        session.close()
        print("----------------------------")


def clear_users():
    """
    Delete all users from the database.
    """
    print("--- Clearing Users Table ---")
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        count_before = session.query(User).count()
        print(f"Users before clearing: {count_before}")
        session.query(User).delete()
        session.commit()
        count_after = session.query(User).count()
        print(f"Users after clearing: {count_after}")
        print("Successfully cleared users table!")
    except Exception as e:
        print(f"Error clearing users: {e}")
        session.rollback()
    finally:
        session.close()
        print("-----------------------------")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "clear":
        clear_users()
    else:
        verify_users()
        print("\nUsage:")
        print("  python verify-users.py        # Show user data")
        print("  python verify-users.py clear  # Clear all users")
