FROM oven/bun:1.1.7 as node-builder
WORKDIR /app
COPY . /app

RUN bun install --frozen-lockfile
RUN bun run build

FROM nginx:alpine3.18-slim

LABEL maintainer="Rizul Hanif"

COPY --from=node-builder /app/dist /usr/share/nginx/html
COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf
