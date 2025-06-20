FROM node:22.15.1-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG ENV=production
RUN if [ "$ENV" = "staging" ]; then \
      cp .env.staging .env; \
    elif [ "$ENV" = "production" ]; then \
      cp .env.prod .env; \
    fi


RUN npm run build

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Remove the existing node_modules directory and only install production dependencies
RUN npm ci --only=production && npm cache clean --force


FROM node:22.15.1-alpine AS production

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

CMD ["npm", "start"]