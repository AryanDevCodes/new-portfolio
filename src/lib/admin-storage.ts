/**
 * Admin data storage layer — uses Upstash Redis via REDIS_URL
 */

import { createClient } from "redis";

type DataKey =
  | "mediumSettings"
  | "featuredPosts"
  | "certifications"
  | "skills"
  | "heroData"
  | "socialLinks"
  | "experience"
  | "education"
  | "additionalData";

let redisClient: ReturnType<typeof createClient> | null = null;
let redisReady = false;

async function initRedis() {
  if (redisReady) return;
  if (!process.env.REDIS_URL) {
    redisReady = true;
    return; // No Redis URL; skip initialization
  }
  try {
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    redisReady = true;
  } catch (e) {
    console.error("Failed to connect to Redis:", e);
    redisClient = null;
    redisReady = true;
  }
}

export async function getAdminData(key: DataKey): Promise<unknown> {
  await initRedis();
  if (!redisClient) {
    return null; // No Redis available; return null so API falls back or uses defaults
  }
  try {
    const value = await redisClient.get(`admin:${key}`);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(`Failed to get Redis data for ${key}:`, e);
    return null;
  }
}

export async function setAdminData(key: DataKey, data: unknown): Promise<void> {
  await initRedis();
  if (!redisClient) {
    return; // No Redis available; silently skip
  }
  try {
    await redisClient.set(`admin:${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to set Redis data for ${key}:`, e);
  }
}

export async function deleteAdminData(key: DataKey): Promise<void> {
  await initRedis();
  if (!redisClient) {
    return;
  }
  try {
    await redisClient.del(`admin:${key}`);
  } catch (e) {
    console.error(`Failed to delete Redis data for ${key}:`, e);
  }
}
