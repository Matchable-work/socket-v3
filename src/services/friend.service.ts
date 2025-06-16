import { Socket } from 'socket.io';
import { queueNotification } from './notification.service';
import logger from '../utils/logger';

interface FriendUpdatePayload {
    toUserId: number;
    title: string;
    body: string;
    url: string;
    actor: {
        id: number;
        name: string;
        avatar: string | null;
        type: 'candidate' | 'recruiter';
    };
    type: 'friend_request' | 'friend_accept' | 'friend_decline';
    meta?: Record<string, any>;
}

export async function handleFriendUpdate(socket: Socket, payload: FriendUpdatePayload) {
    const {
        toUserId,
        title,
        body,
        url,
        actor,
        type,
        meta = {},
    } = payload;

    const ts = Date.now();

    const io = socket.nsp; // ✅ Get Namespace-scoped IO instance

    // 1. Emit to friend:update for specific room
    io.to(`user:${toUserId}`).emit('friend:update', {
        title,
        body,
        url,
        type,
        ts,
        by: actor,
        ...meta,
    });

    logger.info(`Emitted friend:update to user:${toUserId}`);

    // 2. Also queue global notification
    await queueNotification(`user:${toUserId}`, {
        title,
        body,
        url,
        type,
        from: actor.id,
        ts,
    });

    logger.info(`Queued notification:new for user:${toUserId}`);
}
