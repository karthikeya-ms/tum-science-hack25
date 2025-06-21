import os
import json

from app.repositories.sectors_repository import SectorsRepository
from app.dtos import SectorCreate
from app.enums import SectorStatus


def seed():
    seed_sectors()


def seed_sectors():
    sectors_repo = SectorsRepository()
    json_file_path = os.path.join(os.path.dirname(__file__), "../../files/sectors.json")
    if not os.path.exists(json_file_path):
        print(f"JSON file not found at {json_file_path}")
        return

    try:
        with open(json_file_path, "r") as file:
            data = json.load(file)
            features = data.get("features", [])
            print(f"Found {len(features)} features in the JSON file")

            for feature in features[:5]:
                try:
                    geometry = feature["geometry"]
                    properties = feature.get("properties", {})

                    sector_data = SectorCreate(
                        geometry=geometry,
                        status=SectorStatus.CLEAR,
                        risk_probability=properties.get("risk", 0.0),
                    )

                    created_sector = sectors_repo.create_sector(sector_data)
                    print(f"Created sector with ID: {created_sector.id}")

                except Exception as e:
                    print(f"Error creating sector from feature: {e}")

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")


if __name__ == "__main__":
    print("Running database seeder...")
    seed_sectors()
    print("Database seeder completed.")
