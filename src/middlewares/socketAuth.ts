import { Socket } from 'socket.io';
import axios from 'axios';
import redis from '../config/redis';

export async function socketAuth(socket: Socket, next: (err?: Error) => void): Promise<void> {
  const token = socket.handshake.auth.token;

  if (!token || typeof token !== 'string') {
    return next(new Error('Unauthorized: No token provided'));
  }

  const cacheKey = `sanctum_token_cache:${token}`;
  const apiBaseUrl = process.env.LARAVEL_API_BASE_URL || 'http://127.0.0.1:8000';

  try {
    // 1. Try Redis first
    const cached = await redis.get(cacheKey);
    if (cached) {
      socket.data.user = JSON.parse(cached);
      return next();
    }

    // 2. Call Laravel API to validate Sanctum token
    const { data } = await axios.get(`${apiBaseUrl}/api/v1/candidate/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    // 3. Extract user from payload
    if (!data?.payload) {
      return next(new Error('Unauthorized: Invalid response format'));
    }

    const user = data.payload;

    // 4. Cache the user info for 1 hour
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);

    // 5. Attach to socket
    socket.data.user = user;

    return next();
  } catch (error: any) {
    const errMsg =
        error?.response?.data?.message || error.message || 'Unauthorized: Token error';
    console.error('[SocketAuth] Sanctum token failed →', errMsg);
    return next(new Error(`Unauthorized: ${errMsg}`));
  }
}
