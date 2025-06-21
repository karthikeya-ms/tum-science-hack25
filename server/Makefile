seed:
	- docker compose run --rm --entrypoint="python -c 'from app.utils.seeds import seed; seed()'" server

seed-sectors:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python seed_sectors.py" server

seed-users:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python seed_users.py" server

verify-sectors:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python verify_sectors.py" server

clear-sectors:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python verify_sectors.py clear" server

verify-users:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python verify-users.py" server

clear-users:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python verify-users.py clear" server

init-db:
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python create_tables.py" server
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python seed_users.py" server
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python seed_sectors.py" server

test:
	- docker compose run --rm --entrypoint="pytest tests" server

clean: clear-users clear-sectors
	@echo "Destroying model tables..."
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python drop_tables.py" server
	@echo "Database tables destroyed!"

drop-tables:
	@echo "Dropping model tables..."
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python drop_tables.py" server

reset-db: clean init-db
	@echo "Database reset complete!"

generate-sectors:
	@echo "Generating sectors data from government.py..."
	- docker compose run --rm -e POSTGRESQL_HOST=db --entrypoint="python app/services/government.py" server
	@echo "Sectors data generated at app/files/sectors.json"

.PHONY: seed seed-sectors seed-users verify-sectors verify-users clear-sectors clear-users init-db test clean drop-tables reset-db generate-sectors