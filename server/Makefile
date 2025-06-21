seed:
	- docker compose run --rm --entrypoint="python -c 'from app.utils.seeds import seed; seed()'" server
test:
	- docker compose run --rm --entrypoint="pytest tests" server
clean:
	docker compose run --rm --entrypoint="python -c 'from app.utils.clean import clean; clean()'" server

.PHONY: seed test clean