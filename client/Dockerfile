# Stage 1 — Build React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Set API URL for production build
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the React app for production
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine AS production

# Copy built React files to Nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]