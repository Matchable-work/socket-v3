import { Socket } from 'socket.io';
import { Queue } from 'bullmq';
import redis from '../../config/redis';

const jobQueue = new Queue('job', { connection: redis });

export function jobEvents(socket: Socket): void {
  socket.on('job:publish', (data, ack) => {
    socket.to('role:candidate').emit('job:publish', { jobId: data.jobId, title: data.title, companyId: data.companyId });
    ack?.({ sent: true });
  });

  socket.on('job:update', (data, ack) => {
    socket.to(`job:${data.jobId}`).emit('job:update', { field: data.field, newValue: data.newValue });
    ack?.({ sent: true });
  });

  socket.on('job:close', (data, ack) => {
    socket.to(`job:${data.jobId}`).emit('job:close', { reason: data.reason });
    ack?.({ sent: true });
  });

  socket.on('application:status', (data, ack) => {
    socket.to(`user:${data.applicantId}`).emit('application:status', { jobId: data.jobId, status: data.status });
    ack?.({ sent: true });
  });
}
