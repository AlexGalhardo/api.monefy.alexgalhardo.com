#!/bin/bash
bun install
docker stop $(docker ps -q) && docker rm $(docker ps -aq)
docker-compose down
docker-compose up -d
echo '...waiting docker-compose up -d...'
sleep 3
bun prisma migrate dev
bun run dev
