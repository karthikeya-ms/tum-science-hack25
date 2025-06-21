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

test:
	- docker compose run --rm --entrypoint="pytest tests" server

clean:
	docker compose run --rm --entrypoint="python -c 'from app.utils.clean import clean; clean()'" server

.PHONY: seed seed-sectors seed-users verify-sectors verify-users clear-sectors clear-users test clean