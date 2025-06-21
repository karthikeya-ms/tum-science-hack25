from fastapi import APIRouter

from app.dtos import HelloWorldResponse

router = APIRouter(tags=["root"])


@router.get("/")
def read_root() -> HelloWorldResponse:
    return HelloWorldResponse(message="Hello World")
