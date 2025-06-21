from app.database import engine
from app.models import User, Sector
from sqlalchemy import MetaData, inspect


def drop_tables():
    """
    Drop only the tables defined in models.py (User, Sector).
    """
    print("--- Dropping Tables Defined in Models ---")

    # Get the table objects from your models
    tables_to_drop = [User.__table__, Sector.__table__]
    table_names = [table.name for table in tables_to_drop]

    try:
        # Check which tables actually exist in the database
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()

        print(f"Tables to drop: {table_names}")
        print(f"Existing tables in database: {existing_tables}")

        # Only drop tables that both exist and are defined in models
        tables_to_actually_drop = []
        for table in tables_to_drop:
            if table.name in existing_tables:
                tables_to_actually_drop.append(table)
                print(f"  ✓ Will drop: {table.name}")
            else:
                print(f"  ⚠ Table not found in database: {table.name}")

        if tables_to_actually_drop:
            # Create a metadata object and bind only the tables we want to drop
            metadata = MetaData()
            for table in tables_to_actually_drop:
                table.tometadata(metadata)

            # Drop only these specific tables
            metadata.drop_all(bind=engine)

            dropped_names = [table.name for table in tables_to_actually_drop]
            print(f"Successfully dropped tables: {dropped_names}")
        else:
            print("No model tables found to drop.")

    except Exception as e:
        print(f"Error dropping tables: {e}")
    print("----------------------------------------")


if __name__ == "__main__":
    drop_tables()
