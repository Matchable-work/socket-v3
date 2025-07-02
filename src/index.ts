import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createRedisClient } from './config/redis';
import { createApp } from './app';
import { initSocketLayer } from './sockets/core';
import { getIO, setIO } from './utils/io';
import { handleLaravelRedisMessage } from './utils/laravelRedisBridge';

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'https://matchable.work',
      'https://api-matchable.work',
      'https://stage-api-matchable.work',
      'https://recruiter.matchable.work',
      'https://matchable-api.test',
      'http://localhost:3000',
      'http://127.0.0.1:8000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setIO(io);

// Redis pub/sub setup
const pubClient = createRedisClient();
const subClient = createRedisClient();
io.adapter(createAdapter(pubClient, subClient));

// Subscribe only to Laravel broadcast channels
subClient.psubscribe('matchable_database_private-*').then(() => {
  console.log('[Redis] Subscribed to Laravel broadcast channels only');
});

subClient.on('pmessage', (_pattern: string, channel: string, raw: Buffer | string) => {
  handleLaravelRedisMessage(channel, raw);
});

// Register socket.io event handlers
initSocketLayer(io);

// Start server
const PORT = process.env.PORT || 4200;
console.log('[Redis] Server listening on port ', PORT);
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
