# Configuration
API_BASE_URL ?= http://server:8000
OPENAPI_GENERATOR_VERSION ?= 7.2.0
CLIENT_OUTPUT_DIR ?= src/api
OPENAPI_SPEC_URL ?= $(API_BASE_URL)/openapi.json
OPENAPI_SPEC_FILE ?= openapi.json

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  install              - Install dependencies"
	@echo "  dev                  - Start development server"
	@echo "  build                - Build for production"
	@echo "  generate-client      - Generate OpenAPI client from server"
	@echo "  download-spec        - Download OpenAPI spec from server"
	@echo "  clean-client         - Remove generated client files"
	@echo "  setup-generator      - Install OpenAPI Generator CLI"
	@echo "  lint                 - Run ESLint"
	@echo "  preview              - Preview production build"

# Install dependencies
.PHONY: install
install:
	npm ci

# Development server
.PHONY: dev
dev:
	npm run dev

# Production build
.PHONY: build
build:
	npm run build

# Download OpenAPI specification from server
.PHONY: download-spec
download-spec:
	@echo "Downloading OpenAPI spec from $(OPENAPI_SPEC_URL)..."
	@curl -f -o $(OPENAPI_SPEC_FILE) $(OPENAPI_SPEC_URL) || \
        (echo "Error: Could not download OpenAPI spec. Make sure your server is running at $(API_BASE_URL)" && exit 1)
	@echo "OpenAPI spec downloaded to $(OPENAPI_SPEC_FILE)"

# Setup OpenAPI Generator CLI (using npm)
.PHONY: setup-generator
setup-generator:
	@echo "Installing OpenAPI Generator CLI..."
	npm install -g @openapitools/openapi-generator-cli
	@echo "OpenAPI Generator CLI installed successfully"

# Clean generated client files
.PHONY: clean-client
clean-client:
	@echo "Cleaning generated client files..."
	rm -rf $(CLIENT_OUTPUT_DIR)
	rm -f $(OPENAPI_SPEC_FILE)
	@echo "Client files cleaned"

# Generate OpenAPI client
.PHONY: generate-client
generate-client: download-spec
	@echo "Generating OpenAPI client..."
	@mkdir -p $(CLIENT_OUTPUT_DIR)
    
    # Generate TypeScript Axios client
	npx @openapitools/openapi-generator-cli generate \
        -i $(OPENAPI_SPEC_FILE) \
        -g javascript \
        -o $(CLIENT_OUTPUT_DIR) \
        --additional-properties=auseES6=true,apiPackage=api,modelPackage=models
    
	@echo "Installing generated client dependencies..."
	npm install axios
    
	@echo "OpenAPI client generated successfully in $(CLIENT_OUTPUT_DIR)"
	@echo ""
	@echo "Usage example:"
	@echo "import { DefaultApi, Configuration } from './src/api';"
	@echo "const config = new Configuration({ basePath: '$(API_BASE_URL)' });"
	@echo "const api = new DefaultApi(config);"

# Alternative: Generate using Docker (if you prefer not to install globally)
.PHONY: generate-client-docker
generate-client-docker: download-spec
	@echo "Generating OpenAPI client using Docker..."
	@mkdir -p $(CLIENT_OUTPUT_DIR)
    
	docker run --rm \
        -v $(PWD):/local \
        openapitools/openapi-generator-cli generate \
        -i /local/$(OPENAPI_SPEC_FILE) \
        -g javascript \
        -o /local/$(CLIENT_OUTPUT_DIR) \
        --additional-properties=useES6=true,apiPackage=api,modelPackage=models
    
	@echo "Installing generated client dependencies..."
	npm install axios
    
	@echo "OpenAPI client generated successfully in $(CLIENT_OUTPUT_DIR)"

# Generate with custom server URL
.PHONY: generate-client-dev
generate-client-dev:
	$(MAKE) generate-client API_BASE_URL=http://localhost:8000

.PHONY: generate-client-prod
generate-client-prod:
	$(MAKE) generate-client API_BASE_URL=https://api.demining.tum.de

# Lint code
.PHONY: lint
lint:
	npm run lint

# Preview production build
.PHONY: preview
preview:
	npm run preview

# Full setup: install dependencies and generate client
.PHONY: setup
setup: install setup-generator generate-client
	@echo "Full setup complete!"

# Development workflow: clean, generate, and start dev server
.PHONY: dev-full
dev-full: clean-client generate-client dev

.PHONY: all
all: help