# Use the same Node version as local
FROM node:20

# Create app directory inside container
WORKDIR /app

# Copy only the package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else (your code)
COPY . .

RUN npx prisma generate

# Build the TypeScript source
RUN npm run build

# App will run on port 4000
EXPOSE 4000

# Start the built server
CMD ["node", "dist/app.js"]
