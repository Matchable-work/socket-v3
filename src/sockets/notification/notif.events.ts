import { Socket } from 'socket.io';
import { Queue } from 'bullmq';
import redis from '../../config/redis';
import logger from '../../utils/logger';
import { validateNotificationPayload } from '../../requests/NotificationRequest';

const notifQueue = new Queue('notification', { connection: redis });

interface NotificationPayload {
  to: string; // Socket.io room, e.g., user:12
  title: string;
  body: string;
  url?: string;
  type?: string;
  actor?: {
    id: number;
    type: 'candidate' | 'recruiter' | 'system';
    name: string;
    avatar?: string | null;
  };
}

export function notifEvents(socket: Socket): void {
  socket.on(
      'notification:push',
      async (rawData: unknown, ack?: (response: { queued?: boolean; error?: string }) => void) => {
        try {
          const { to, title, body, url, type, actor }: NotificationPayload = validateNotificationPayload(rawData);

          await notifQueue.add('push', {
            room: to,
            payload: {
              title,
              body,
              url,
              type,
              by: actor ?? {
                id: null,
                type: 'system',
                name: 'System',
                avatar: null,
              },
              ts: Date.now(),
            },
          });

          logger.info(`[notification:push] Queued for room "${to}" from socket ${socket.id}`);
          ack?.({ queued: true });

        } catch (err: any) {
          const details = err?.details
              ? err.details.map((d: any) => d.message).join('; ')
              : err.message;

          logger.warn(`[notification:push] Invalid payload from socket ${socket.id}: ${details}`);
          ack?.({ error: details });
        }
      }
  );
}
