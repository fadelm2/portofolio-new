.PHONY: build up down restart logs status deploy

# Build Docker image
build:
	docker compose build

# Start the container in the background
up:
	docker compose up -d

# Stop and remove the container
down:
	docker compose down

# Restart the container
restart:
	docker compose restart

# View real-time logs of the container
logs:
	docker compose logs -f --tail=100

# Check container status
status:
	docker compose ps

# Single command to redeploy: stop, rebuild, and start again
deploy: down build up status
