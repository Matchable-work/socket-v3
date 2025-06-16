import { Socket } from 'socket.io';
const WINDOW = 1000;
const MAX = 10;
const map = new Map<string, { c: number; t: number }>();

export function rateLimit(socket: Socket, next: (err?: Error) => void): void {
  const now = Date.now();
  const entry = map.get(socket.id) || { c: 0, t: now };
  if (now - entry.t > WINDOW) {
    entry.c = 0; entry.t = now;
  }
  if (entry.c >= MAX) return next(new Error('Rate limit exceeded'));
  entry.c++;
  map.set(socket.id, entry);
  next();
}
