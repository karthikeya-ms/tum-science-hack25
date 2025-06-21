from sqlalchemy import create_engine, Column, DateTime, func
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


db_url = (
    f"postgresql+pg8000://{settings.postgresql_user}:{settings.postgresql_password}"
    f"@{settings.postgresql_host}:{settings.postgresql_port}/{settings.postgresql_db}"
)
engine = create_engine(db_url, pool_size=20, max_overflow=-1)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class TimestampMixin:
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CustomBase(TimestampMixin):
    pass


Base = declarative_base(cls=CustomBase)
