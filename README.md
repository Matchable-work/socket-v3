# Realtime Node Socket Server (TypeScript)

Production-ready Socket.IO server for Laravel + Next.js integration.

## Features

- **TypeScript** with strict compiler settings
- **Socket.IO v4** with Redis adapter for horizontal scaling
- JWT authentication middleware
- Per-socket rate limiting
- Modular namespaces: `/chat`, `/notifications`, `/presence`, `/friends`
- Redis‑backed presence tracking with automatic expiry
- Winston logging, Helmet security headers
- Prometheus metrics stub
- Ready for Docker & PM2 cluster

## Quick Start

```bash
# install dependencies
yarn install

# copy & edit environment variables
cp .env.example .env

# run in dev mode (auto‑reload)
yarn dev

# compile & run in prod
yarn build
node dist/server.js
```

## Dev Scripts

| Script      | Description                  |
|-------------|------------------------------|
| `yarn dev`  | ts-node-dev auto reload      |
| `yarn build`| Compile TypeScript to `dist` |
| `yarn start`| Run compiled server          |

## Docker

```bash
docker build -t socket-server .
docker run -p 4201:4201 --env-file .env socket-server
```

## PM2

```bash
yarn build
pm2 start pm2.config.js
```

## Folder Layout

```
src/
  events/        # namespace handlers
  middlewares/   # auth & rate limit
  utils/         # logger, metrics, validation
  redisClient.ts # Redis adapter & presence helpers
  server.ts      # entry point
```

## License

MIT
