import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function checkUsernameExists(username: string): Promise<boolean> {
  const key = `user:${username.toLowerCase()}`;
  const exists = await redis.exists(key);
  return exists === 1;
}

export async function getUserData(username: string): Promise<any | null> {
  const key = `user:${username.toLowerCase()}`;
  const data = await redis.get(key);
  return data;
}

export async function saveUserData(username: string, data: any): Promise<void> {
  const key = `user:${username.toLowerCase()}`;
  await redis.set(key, JSON.stringify(data));
}

export async function deleteUserData(username: string): Promise<void> {
  const key = `user:${username.toLowerCase()}`;
  await redis.del(key);
}

export { redis };
