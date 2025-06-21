# Sector Seeding Documentation

This document explains how to seed the `sectors` table with data from the `sectors.json` file.

## Overview

The seeding functionality reads GeoJSON features from `app/files/sectors.json` and populates the PostgreSQL `sectors` table with the first 5 features. Each feature is converted from GeoJSON format to PostGIS-compatible polygons.

## Files

- `seed_sectors.py` - Main seeding script
- `verify_sectors.py` - Verification and management script
- `app/files/sectors.json` - Source data file (25,597 features)
- `Makefile` - Contains convenient commands

## Database Schema

The sectors table contains:
- `id` - UUID primary key
- `geometry` - PostGIS POLYGON geometry (SRID 4326)
- `area_sqm` - Area in square meters (calculated)
- `risk_probability` - Risk value from source data (0.0-1.0)
- `total_mines_found` - Integer (default: 0)
- `status` - Enum: 'mined', 'demined', 'clear', 'probable' (default: 'mined')
- `created_at`, `updated_at` - Timestamps
- Assignment fields (nullable): `assigned_to_ngo_id`, `assigned_to_team_lead_id`, `assigned_to_operator_id`

## Usage

### Using Make Commands (Recommended)

```bash
# Seed the sectors table with first 5 features
make seed-sectors

# Verify the seeded data
make verify-sectors

# Clear all sectors
make clear-sectors
```

### Using Python Scripts Directly

```bash
# Set environment variables (if not using Docker)
export POSTGRESQL_USER=postgres
export POSTGRESQL_PASSWORD=postgres
export POSTGRESQL_HOST=localhost
export POSTGRESQL_PORT=5432
export POSTGRESQL_DB=postgres

# Seed sectors
python seed_sectors.py

# Verify sectors
python verify_sectors.py

# Clear sectors
python verify_sectors.py clear
```

### Using Docker Compose

```bash
# Seed sectors
docker compose run --rm --entrypoint="python seed_sectors.py" server

# Verify sectors
docker compose run --rm --entrypoint="python verify_sectors.py" server
```

## Example Output

### Seeding Output
```
--- Seeding Sectors Table ---
Reading sectors data from: app/files/sectors.json
Total features in file: 25597
Seeding first 5 features...
Clearing existing sectors...
Added sector 1: Risk=0.0, Area=1232100.00 sqm
Added sector 2: Risk=0.0, Area=1232100.00 sqm
Added sector 3: Risk=0.0, Area=1232100.00 sqm
Added sector 4: Risk=0.0, Area=1232100.00 sqm
Added sector 5: Risk=0.0, Area=1232100.00 sqm
Successfully seeded sectors table!
Total sectors in database: 5
```

### Verification Output
```
--- Verifying Sectors Data ---
Total sectors in database: 5
Sector 1:
  ID: c6e588f3-9bae-4d2e-9304-2ca8b809508c
  Area: 1232100.00 square meters
  Risk Probability: 0.0
  Status: mined
  Mines Found: 0
  Created: 2025-06-21 09:06:41.121500+00:00
  Assigned NGO: None
  Assigned Team Lead: None
  Assigned Operator: None
  Geometry (WKT preview): POLYGON((35.297591815586124 49.041713255668185,...

Statistics:
Total Area: 6160500.00 square meters (6.16 square kilometers)
Average Risk: 0.000
Status Distribution: {'mined': 5}
```

## Source Data Structure

The `sectors.json` file contains a GeoJSON FeatureCollection with features like:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "risk": 0.0,
        "source": "https://simplemaps.com",
        "name": "Ukraine",
        "partner": "A"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[
          [35.297591815586124, 49.041713255668185],
          [35.297591815586124, 49.051713255668183],
          [35.307591815586122, 49.051713255668183],
          [35.307591815586122, 49.041713255668185],
          [35.297591815586124, 49.041713255668185]
        ]]]
      }
    }
  ]
}
```

## Dependencies

Required Python packages (included in `requirements.txt`):
- `sqlalchemy` - Database ORM
- `geoalchemy2` - PostGIS support
- `shapely` - Geometry calculations
- `pydantic-settings` - Configuration management

## Configuration

Database connection is configured via environment variables:
- `POSTGRESQL_USER` (default: postgres)
- `POSTGRESQL_PASSWORD` (default: postgres)
- `POSTGRESQL_HOST` (default: db for Docker, localhost for local)
- `POSTGRESQL_PORT` (default: 5432)
- `POSTGRESQL_DB` (default: postgres)

## Error Handling

The scripts include comprehensive error handling:
- File existence checks
- JSON validation
- Database connection errors
- Geometry conversion errors
- Transaction rollback on failure

## Customization

To modify the seeding behavior:

1. **Change number of features**: Edit the slice in `seed_sectors.py`:
   ```python
   features_to_seed = features[:10]  # Change 5 to desired number
   ```

2. **Preserve existing data**: Comment out the clear operation:
   ```python
   # session.query(Sector).delete()
   # session.commit()
   ```

3. **Filter features**: Add filtering logic:
   ```python
   features_to_seed = [f for f in features if f['properties']['risk'] > 0.5]
   ```

## Troubleshooting

### Common Issues

1. **"ModuleNotFoundError: No module named 'sqlalchemy'"**
   - Install dependencies: `pip install -r docs/requirements.txt`

2. **Database connection errors**
   - Ensure PostgreSQL is running: `docker compose ps`
   - Check environment variables
   - Verify database credentials

3. **"sectors.json not found"**
   - Ensure you're in the `server` directory
   - Verify file exists at `app/files/sectors.json`

4. **Geometry conversion errors**
   - Check GeoJSON format in source file
   - Ensure coordinates are valid longitude/latitude pairs

### Database Checks

```sql
-- Connect to PostgreSQL and run:
SELECT COUNT(*) FROM sectors;
SELECT id, risk_probability, area_sqm, status FROM sectors LIMIT 5;
SELECT ST_AsText(geometry) FROM sectors LIMIT 1;
``` 