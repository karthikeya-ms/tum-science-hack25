from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    allowed_origin: str = os.getenv("ALLOWED_ORIGIN") or ""
    postgresql_user: str = os.getenv("POSTGRESQL_USER") or ""
    postgresql_password: str = os.getenv("POSTGRESQL_PASSWORD") or ""
    postgresql_host: str = os.getenv("POSTGRESQL_HOST") or ""
    postgresql_port: str = os.getenv("POSTGRESQL_PORT") or ""
    postgresql_db: str = os.getenv("POSTGRESQL_DB") or ""


settings = Settings()
