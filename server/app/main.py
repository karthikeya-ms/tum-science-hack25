import io
import yaml
from fastapi import FastAPI
from fastapi.responses import Response

from app.routes.root import router as root_router
from app.routes.sectors import router as sectors_router
from app.routes.users import router as users_router
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_credentials=True,
    allow_methods=["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials",
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Set-Cookie",
    ],
)


@app.get("/openapi.yaml", include_in_schema=False)
def read_openapi_yaml() -> Response:
    openapi_json = app.openapi()
    yaml_s = io.StringIO()
    yaml.dump(openapi_json, yaml_s)
    return Response(yaml_s.getvalue(), media_type="text/yaml")


app.include_router(root_router)
app.include_router(sectors_router)
app.include_router(users_router)
