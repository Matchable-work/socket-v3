import { Socket } from 'socket.io';
import logger from '../../utils/logger';

export function baseEvents(socket: Socket): void {
    socket.on('leave', ({ room }) => {
        socket.leave(room);
        logger.info(`Socket ${socket.id} left room: ${room}`);
    });
}
