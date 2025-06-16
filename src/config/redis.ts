import Redis from 'ioredis';

export const createRedisClient = () =>
    new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD || undefined,
    });

// ✅ Add this for compatibility
const redis = createRedisClient();
export default redis;
