# SchwarzIT backend

This is the [FastAPI](https://fastapi.tiangolo.com/) backend of the Demining project.

## OpenAPI Specs
https://api.demining.tum.de/docs

### Installing dependencies
To install 3rd party dependencies, run the following command inside the docker container:
```bash
uv pip install <package name>
```
Save the dependencies to `requirements.txt`
```bash
uv pip freeze > docs/requirements.txt
```

### Run linter and formatter
Lint files and fix any fixable errors:
```bash
ruff check --fix
```
Run code formatter:
```bash
ruff format
```

### Run tests

Run the following command inside the docker container:
```bash
pytest tests
```

### Run migration

Edit schema file app/models.py and create a new migration file by running the following command inside the docker container:
```bash
alembic revision --autogenerate -m "Migration name"
```

Apply the migration file:
```bash
alembic upgrade head
```
