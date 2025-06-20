# tum-science-hack25
TUM Science Hackathon 2025 - The Red Embedding

## Setup Instructions

1. Clone the repo:
    ```
    git clone https://github.com/karthikeya-ms/tum-science-hack25.git
    cd tum-science-hack25
    ```

2. Create conda environment:
    ```bash
    conda create --name hack python=3.12
    conda activate hack
    ```

3. Install:
    ```bash
    cd torchlbm
    pip install -e .
    ```
## Local Development

### Setup
1. Install & run [Docker Desktop](https://www.docker.com/products/docker-desktop/)
1. Add the following entries to `/etc/hosts`:
    ```
    127.0.0.1 demining.tum.de api.demining.tum.de
    ```
1. Generate public/ private key pair inside ./docker/nginx using the following command
   ```bash
   openssl req -x509 -newkey rsa:4096 -sha256 -days 365 \
     -nodes -keyout private.key -out cert.crt \
     -subj "/CN=demining.tum.de" \
     -addext "subjectAltName=DNS:demining.tum.de,DNS:api.demining.tum.de"
   ```
1. Add `./docker/nginx/cert.crt` to your trust store 
1. linux cmd `sudo trust anchor --store /path/to/cert.crt`
1. Start the server using `docker compose up -d`
1. The server is accessible at `https://api.demining.tum.de`
1. The client interface is accessible at `https://demining.tum.de`
