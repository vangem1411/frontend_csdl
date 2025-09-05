FROM node:22.14

WORKDIR /app
COPY package*.json ./

# Cài dependencies
RUN npm install

COPY . .
EXPOSE 5173
# Chạy ở chế độ development để hot reload
CMD ["npm", "run", "dev", "--", "--host"]
