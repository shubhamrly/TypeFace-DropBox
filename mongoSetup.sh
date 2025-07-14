# green for success, then reset color
GREEN="\033[0;32m"
NC="\033[0m"

echo -e "${GREEN}➡ Pulling MongoDB Docker image...${NC}"
docker pull mongo:latest

echo -e "${GREEN}➡ Checking if MongoDB container already exists...${NC}"
if [ "$(docker ps -a -q -f name=local-mongo)" ]; then
  echo -e "${GREEN}➡ Container exists. Removing old container...${NC}"
  docker rm -f local-mongo
fi

echo -e "${GREEN}➡ Starting MongoDB container...${NC}"
docker run -d \
  --name local-mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:latest
  
echo -e "${GREEN}✅ MongoDB is running on localhost:27017"
