import { Socket } from 'socket.io';

export function teamEvents(socket: Socket): void {
  socket.on('team:note', (data) => {
    socket.to(`company:${data.companyId}`).emit('team:note', { note: data.note, authorId: socket.data.user.id, ts: Date.now() });
  });

  socket.on('team:mention', (data) => {
    socket.to(`user:${data.toUserId}`).emit('team:mention', { noteId: data.noteId, from: socket.data.user.id, ts: Date.now() });
  });

  socket.on('team:chat', (data) => {
    socket.to(`company:${data.companyId}`).emit('team:chat', { from: socket.data.user.id, message: data.message, ts: Date.now() });
  });
}
