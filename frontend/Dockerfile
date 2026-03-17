# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
ARG NODE_AUTH_TOKEN
COPY package*.json ./
RUN echo "@css-ch:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> .npmrc
RUN npm install
RUN rm -f .npmrc
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
