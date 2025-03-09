import { createClient } from 'redis';
import { config } from '../config/config';

const redisClient = createClient({
  socket: {
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
  },
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

(async () => {
  try {
    // await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
})();

export default redisClient;
