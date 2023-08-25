#!/bin/bash
docker compose -f docker-compose.multi.yaml logs --tail 1 -f=true --no-log-prefix | npm run logs
