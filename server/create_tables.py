from app.database import engine
from app.models import Base


def initialize_database():
    """
    Connects to the database, drops all existing tables defined in the models,
    and creates new ones.
    """
    print("--- Initializing Database Schema ---")
    try:
        print("Dropping all tables...")
        # This will drop all tables associated with the Base metadata
        Base.metadata.drop_all(bind=engine)
        print("Tables dropped successfully.")

        print("\nCreating all tables...")
        # This will create all tables associated with the Base metadata
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully.")
        print("------------------------------------")

    except Exception as e:
        print(f"An error occurred during database initialization: {e}")


if __name__ == "__main__":
    # This allows the script to be run directly from the command line.
    # Execute from within the 'server' container: `python create_tables.py`
    initialize_database()
