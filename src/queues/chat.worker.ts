import { Worker } from 'bullmq';
import redis from '../config/redis';
import { getIO } from '../utils/io';
import logger from '../utils/logger';

new Worker('chat', async job => {
  try {
    const { room, payload } = job.data;
    getIO().to(room).emit('chat:message', payload);
    logger.info(`Emitted chat message to ${room}`);
  } catch (err) {
    logger.error('Error in chat.worker:', err);
    throw err;
  }
}, { connection: redis });
