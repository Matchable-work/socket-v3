import { Worker } from 'bullmq';
import redis from '../config/redis';
import { getIO } from '../utils/io';
import logger from '../utils/logger';

new Worker('notification', async job => {
  try {
    const { room, payload } = job.data;
    getIO().to(room).emit('notification:receive', payload);
    logger.info(`Emitted notification to ${room}`);
  } catch (err) {
    logger.error('Error in notif.worker:', err);
    throw err;
  }
}, { connection: redis });
