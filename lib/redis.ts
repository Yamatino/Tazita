import { Redis } from '@upstash/redis';

// For browser/client-side usage with Upstash REST API
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || '',
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || '',
});

export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const key = `user:${username.toLowerCase()}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Redis error:', error);
    return false;
  }
}

export async function getUserData(username: string): Promise<any | null> {
  try {
    const key = `user:${username.toLowerCase()}`;
    const data = await redis.get(key);
    return data;
  } catch (error) {
    console.error('Redis error:', error);
    return null;
  }
}

export async function saveUserData(username: string, data: any): Promise<void> {
  try {
    const key = `user:${username.toLowerCase()}`;
    await redis.set(key, data);
  } catch (error) {
    console.error('Redis error:', error);
    throw error;
  }
}

export async function deleteUserData(username: string): Promise<void> {
  try {
    const key = `user:${username.toLowerCase()}`;
    await redis.del(key);
  } catch (error) {
    console.error('Redis error:', error);
    throw error;
  }
}

export { redis };
