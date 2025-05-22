FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["sh", "-c", "node src/database/init.js && node src/database/bulk_insert.js && node src/database/insert_managers.js && node src/server.js"]
