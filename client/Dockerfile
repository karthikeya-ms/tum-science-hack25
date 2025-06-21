FROM node:22.15.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --production=false

COPY . .

ARG VITE_API_BASE_URL_ARG
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL_ARG

RUN npm run build

FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]