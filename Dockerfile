FROM node:24-slim AS build
WORKDIR /app
ENV SKIP_SIMPLE_GIT_HOOKS=1
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Fail the build (and keep the running site) if the nginx config is invalid.
RUN nginx -t
EXPOSE 80
