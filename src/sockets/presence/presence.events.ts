import { Socket } from 'socket.io';
import redis from '../../config/redis';

const PRES_KEY = 'presence';

export function presenceEvents(socket: Socket): void {
  const userId = socket.data.user.id;
  redis.hset(PRES_KEY, userId.toString(), Date.now().toString());

  socket.on('presence:list', async (_data, ack) => {
    const all = await redis.hgetall(PRES_KEY);
    ack?.(all);
  });

  socket.on('disconnect', () => {
    redis.hdel(PRES_KEY, userId.toString());
  });
}
