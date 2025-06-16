import { Socket } from 'socket.io';
import { Queue } from 'bullmq';
import redis from '../../config/redis';
import logger from '../../utils/logger';
import { validateChatPayload } from '../../requests/ChatRequest';

const chatQueue = new Queue('chat', { connection: redis });

export function chatEvents(socket: Socket): void {
  socket.on('chat:send', async (rawData, ack) => {
    try {
      const { threadId, content, type } = validateChatPayload(rawData);
      await chatQueue.add('persist', {
        room: threadId,
        payload: {
          from: socket.data.user.id,
          content,
          type,
          ts: Date.now(),
        }
      });
      ack?.({ queued: true });
      logger.info(`Queued chat message for thread ${threadId}`);
    } catch (err) {
      // @ts-ignore
      const details = err.details ? err.details.map((d: any) => d.message).join('; ') : err.message;
      logger.warn(`Invalid chat payload from ${socket.id}: ${details}`);
      ack?.({ error: details });
    }
  });

  socket.on('chat:typing:start', (data) => {
    socket.to(`thread:${data.threadId}`).emit('chat:typing:start', { userId: socket.data.user.id });
  });

  socket.on('chat:typing:stop', (data) => {
    socket.to(`thread:${data.threadId}`).emit('chat:typing:stop', { userId: socket.data.user.id });
  });

  socket.on('chat:read', (data, ack) => {
    socket.to(`thread:${data.threadId}`).emit('chat:read', {
      userId: socket.data.user.id,
      lastMessageId: data.lastMessageId
    });
    ack?.({ delivered: true });
  });
}
