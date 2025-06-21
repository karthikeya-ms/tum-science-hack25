FROM ghcr.io/astral-sh/uv:python3.12-alpine AS development
WORKDIR /app

RUN apk update && apk add build-base

COPY ./docs/requirements.txt ./requirements.txt
RUN uv pip install -r requirements.txt --system

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

FROM ghcr.io/astral-sh/uv:python3.12-alpine AS production
WORKDIR /app

RUN apk update && apk add build-base

COPY ./docs/requirements.txt ./requirements.txt
RUN uv pip install -r requirements.txt --system

COPY . .

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4