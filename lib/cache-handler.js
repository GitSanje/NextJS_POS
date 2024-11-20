
import { CacheHandler } from '@neshca/cache-handler';
import createRedisHandler from '@neshca/cache-handler/redis-stack';
import createLruHandler from '@neshca/cache-handler/local-lru';
import { createClient } from 'redis';

// Configure the cache handler
CacheHandler.onCreation(async () => {
  let client;

  try {
    client = createClient({
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      }
    });

    client.on('error', (error) => {
      if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== 'undefined') {
        console.error('Redis client error:', error);
      }
    });
  } catch (error) {
    console.warn('Failed to create Redis client:', error);
  }

  if (client) {
    try {
      await client.connect();
      console.info('Redis client connected.');
    } catch (error) {
      console.warn('Failed to connect Redis client:', error);
      await client.disconnect();
    }
  }

  let handler;

  if (client?.isReady) {
    handler = await createRedisHandler({
      client,
      keyPrefix: process.env.REDIS_PREFIX ?? 'prefix',
      timeoutMs: 1000,
    });
  } else {
    handler = createLruHandler();
    console.warn('Falling back to LRU handler because Redis client is not available.');
  }

  return {
    handlers: [handler],
  };
});

export default CacheHandler;



