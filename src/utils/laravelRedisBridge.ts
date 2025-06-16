import { getIO } from './io';

export function isLaravelBroadcastChannel(channel: string): boolean {
    return channel.startsWith('matchable_database_private-');
}

export function parseLaravelRedisMessage(raw: Buffer | string): { event: string; data: any } | null {
    const str = typeof raw === 'string' ? raw : raw.toString('utf8');

    if (!str.trim().startsWith('{')) return null;

    try {
        const { event, data } = JSON.parse(str);
        if (!event || typeof data === 'undefined') return null;
        return { event, data };
    } catch {
        return null;
    }
}

export function handleLaravelRedisMessage(channel: string, raw: Buffer | string): void {
    if (!isLaravelBroadcastChannel(channel)) return;

    const message = parseLaravelRedisMessage(raw);
    if (!message) return;

    const { event, data } = message;
    const socketRoom = channel.replace(/^.*private-/, ''); // e.g., user:2

    try {
        const io = getIO();
        io.to(socketRoom).emit(event, data);
        console.log(`[Laravel → Socket] ${event} → ${socketRoom}`);
    } catch (err) {
        console.error('[Redis → Socket] Emit failed', {
            room: socketRoom,
            raw: typeof raw === 'string' ? raw : raw.toString('utf8'),
            error: err instanceof Error ? err.message : err,
        });
    }
}
