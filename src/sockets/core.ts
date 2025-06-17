import { Server, Socket } from 'socket.io';
import { socketAuth } from '../middlewares/socketAuth';
import { rateLimit } from '../middlewares/rateLimit';
import { totalConnections, totalDisconnects, totalEvents } from '../metrics/prometheus';
import { chatEvents } from './chat/chat.events';
import { notifEvents } from './notification/notif.events';
import { presenceEvents } from './presence/presence.events';
import { friendsEvents } from './friends/friends.events';
import { jobEvents } from './job/job.events';
import { teamEvents } from './team/team.events';
import { systemEvents } from './system/system.events';
import logger from '../utils/logger';
import {baseEvents} from "./shared/base.events";

export function initSocketLayer(io: Server): void {
  io.use(socketAuth);
  io.use(rateLimit);

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    const userId = user.uuid;

    totalConnections.inc();
    logger.info(`Client connected: ${socket.id}, user ${userId}`);

    // Join essential rooms
    socket.join(`user:${userId}`);
    socket.join('global');

    socket.onAny((event) => {
      totalEvents.labels(event).inc();
      logger.info(`Event "${event}" from ${socket.id}`);
      console.log(`Event "${event}" from ${socket.id}`);
    });

    // Register feature-specific events
    baseEvents(socket);
    chatEvents(socket);
    // notifEvents(socket);
    presenceEvents(socket);
    // friendsEvents(socket);
    // jobEvents(socket);
    // teamEvents(socket);
    systemEvents(socket);

    socket.on('disconnect', (reason) => {
      totalDisconnects.inc();
      logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
}
