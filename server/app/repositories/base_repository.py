from typing import Any
from uuid import UUID

import sqlalchemy

from app.database import SessionLocal


def get_db():
    """
    This function creates a database session.
    Yield to the get_db function, rollback the transaction
    if there's an exception and then finally closes the session.

    Yields:
        db: scoped database session
    """

    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
    finally:
        db.close()


class BaseRepository:
    def __init__(self, model):
        self.model = model
        self.db = SessionLocal()

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is not None:
                self.db.rollback()
        except sqlalchemy.exc.SQLAlchemyError:
            pass
        finally:
            self.db.close()
            SessionLocal.remove()

    def count(self) -> int:
        return self.db.query(self.model).count()

    def find_one_by_id(self, id: UUID) -> Any:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def find_one(self, **kwargs) -> Any:
        return self.db.query(self.model).filter_by(**kwargs).first()

    def find_many(self, **kwargs) -> list[Any]:
        return (
            self.db.query(self.model)
            .filter_by(**kwargs)
            .order_by(self.model.created_at)
            .all()
        )

    def find_many_by_ids(self, ids: list[UUID]) -> list[Any]:
        return (
            self.db.query(self.model)
            .filter(self.model.id.in_(ids))
            .order_by(self.model.created_at)
            .all()
        )

    def insert_one(self, record) -> Any:
        obj = self.model(**record)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def insert_many(self, records) -> list[Any]:
        objs = []
        for record in records:
            obj = self.insert_one(record)
            objs.append(obj)

        return objs

    def update_one(self, record, **kwargs) -> Any:
        obj = self.find_one(**kwargs)
        if obj is None:
            return None

        for key, value in record.items():
            setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def upsert_one(self, record, **kwargs) -> Any:
        obj = self.find_one(**kwargs)
        if obj is None:
            return self.insert_one(record)

        for key, value in record.items():
            setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def upsert_one_by_id(self, id: UUID, record) -> Any:
        obj = self.find_one_by_id(id)
        if obj is None:
            return self.insert_one({"id": id, **record})

        for key, value in record.items():
            setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete_one(self, id: UUID) -> int:
        obj = self.db.get(self.model, id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return 1
        return 0

    def delete_many_by_ids(self, ids: list[UUID]) -> int:
        objs = self.db.query(self.model).filter(self.model.id.in_(ids)).all()
        count = len(objs)
        for obj in objs:
            self.db.delete(obj)
        self.db.commit()
        return count

    def delete_many(self, **kwargs) -> int:
        objs = self.db.query(self.model).filter_by(**kwargs).all()
        count = len(objs)
        for obj in objs:
            self.db.delete(obj)
        self.db.commit()
        return count

    def refresh(self, obj):
        self.db.refresh(obj)
        return obj
