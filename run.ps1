npm install 

cd client
npm run build
cd ..

cd micro1
npm run build
cd ..

cd micro2
npm run build
cd ..

docker compose -f ./docker-compose.multi.yaml build

docker compose -f ./docker-compose.multi.yaml up
