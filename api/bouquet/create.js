import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Validate payload — must have at least some flower data
    if (!body || !body.f || !Array.isArray(body.f) || body.f.length === 0) {
      return res.status(400).json({ error: 'Invalid bouquet data: missing flowers' });
    }

    // Generate a short unique ID (10 chars)
    const id = nanoid(10);
    const key = `bouquet:${id}`;

    // Store in Redis with TTL
    await redis.set(key, JSON.stringify(body), { ex: TTL_SECONDS });

    // Build the share URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const shareUrl = `${protocol}://${host}/b/${id}`;

    return res.status(201).json({ id, shareUrl });
  } catch (err) {
    console.error('Failed to create bouquet share link:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
