import { Socket } from 'socket.io';

export function systemEvents(socket: Socket): void {
  socket.on('sys:maintenance', (data) => {
    socket.to('global').emit('sys:maintenance', { tsStart: data.tsStart, tsEnd: data.tsEnd });
  });
}
