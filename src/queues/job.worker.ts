import { Worker } from 'bullmq';
import redis from '../config/redis';
import { getIO } from '../utils/io';

new Worker('job', async job => {
  const { room, payload } = job.data;
  getIO().to(room).emit(payload.event, payload.data);
}, { connection: redis });
