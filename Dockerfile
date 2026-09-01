FROM node:20-slim

WORKDIR /app

# Copy package files into the backend subdirectory and install
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all project files preserving the exact structure (root and backend/)
COPY . .

# Set working directory to backend so relative paths work identically
WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]