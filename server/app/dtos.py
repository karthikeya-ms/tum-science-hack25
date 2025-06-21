from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class HelloWorldResponse(BaseModel):
    message: str