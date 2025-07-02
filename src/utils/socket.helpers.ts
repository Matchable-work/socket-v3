import type { Server } from 'socket.io';

export async function getActiveUserIds(io: Server): Promise<string[]> {
    const sockets = await io.fetchSockets();
    const userIds = new Set<string>();

    for (const socket of sockets) {
        const user = socket.data.user;
        if (user?.uuid) {
            userIds.add(user.uuid);
        }
    }

    return Array.from(userIds);
}
