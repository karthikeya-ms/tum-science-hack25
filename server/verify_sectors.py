from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

from app.database import engine
from app.models import Sector


def verify_sectors():
    """
    Verify the seeded sectors data by displaying information about each sector.
    """
    print("--- Verifying Sectors Data ---")

    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Get all sectors
        sectors = session.query(Sector).all()

        print(f"Total sectors in database: {len(sectors)}")
        print("=" * 50)

        for i, sector in enumerate(sectors, 1):
            print(f"Sector {i}:")
            print(f"  ID: {sector.id}")
            print(f"  Area: {sector.area_sqm:.2f} square meters")
            print(f"  Risk Probability: {sector.risk_probability}")
            print(f"  Status: {sector.status.value if sector.status else 'None'}")
            print(f"  Mines Found: {sector.total_mines_found}")
            print(f"  Created: {sector.created_at}")
            print(
                f"  Assigned NGO: {sector.assigned_ngo.userName if sector.assigned_ngo else 'None'}"
            )
            print(
                f"  Assigned Team Lead: {sector.assigned_team_lead.userName if sector.assigned_team_lead else 'None'}"
            )
            print(
                f"  Assigned Operator: {sector.assigned_operator.userName if sector.assigned_operator else 'None'}"
            )

            # Get geometry info (first few coordinates)
            geom_query = session.execute(
                text(
                    "SELECT ST_AsText(geometry) as wkt FROM sectors WHERE id = :sector_id"
                ),
                {"sector_id": sector.id},
            ).fetchone()

            if geom_query:
                wkt = geom_query[0]
                # Show just the start of the WKT to avoid overwhelming output
                wkt_preview = wkt[:100] + "..." if len(wkt) > 100 else wkt
                print(f"  Geometry (WKT preview): {wkt_preview}")

            print("-" * 30)

        # Additional statistics
        print("\nStatistics:")
        total_area = sum(sector.area_sqm for sector in sectors)
        avg_risk = (
            sum(sector.risk_probability for sector in sectors) / len(sectors)
            if sectors
            else 0
        )

        print(
            f"Total Area: {total_area:.2f} square meters ({total_area / 1000000:.2f} square kilometers)"
        )
        print(f"Average Risk: {avg_risk:.3f}")

        # Status distribution
        status_counts = {}
        for sector in sectors:
            status = sector.status.value if sector.status else "None"
            status_counts[status] = status_counts.get(status, 0) + 1

        print(f"Status Distribution: {status_counts}")

    except Exception as e:
        print(f"Error verifying sectors: {e}")
    finally:
        session.close()
        print("----------------------------")


def clear_sectors():
    """
    Clear all sectors from the database.
    """
    print("--- Clearing Sectors Table ---")

    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        count_before = session.query(Sector).count()
        print(f"Sectors before clearing: {count_before}")

        session.query(Sector).delete()
        session.commit()

        count_after = session.query(Sector).count()
        print(f"Sectors after clearing: {count_after}")
        print("Successfully cleared sectors table!")

    except Exception as e:
        print(f"Error clearing sectors: {e}")
        session.rollback()
    finally:
        session.close()
        print("-----------------------------")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "clear":
        clear_sectors()
    else:
        verify_sectors()
        print("\nUsage:")
        print("  python verify_sectors.py        # Show sector data")
        print("  python verify_sectors.py clear  # Clear all sectors")
