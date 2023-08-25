# docker-compose -f docker-compose.multi.yaml logs --tail 1 -f=true | ForEach-Object { $_.Split('|')[1] } | npm run logs
docker-compose -f docker-compose.multi.yaml logs --tail 1 -f=true --no-log-prefix | npm run logs
