import { Socket } from 'socket.io';
import { handleFriendUpdate } from '../../services/friend.service';

export function friendsEvents(socket: Socket): void {
  const io = socket.nsp; // Namespace-scoped socket.io instance

  socket.on('friend:update', (payload) => {
    handleFriendUpdate(socket, payload);
  });
}
