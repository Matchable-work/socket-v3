import { Queue } from 'bullmq';
import redis from '../config/redis';
import logger from '../utils/logger';

const notificationQueue = new Queue('notification', { connection: redis });

export async function queueNotification(room: string, payload: any) {
    try {
        await notificationQueue.add('send', { room, payload });
        logger.info(`Notification queued for ${room}`);
    } catch (err) {
        logger.error('Failed to queue notification:', err);
    }
}
