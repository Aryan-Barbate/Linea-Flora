import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN,
});

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string' || id.length < 1 || id.length > 30) {
    return res.status(400).json({ error: 'Invalid bouquet ID' });
  }

  try {
    const key = `bouquet:${id}`;
    const data = await redis.get(key);

    if (!data) {
      return res.status(404).json({ error: 'Bouquet not found' });
    }

    // data may already be parsed by @upstash/redis, or it may be a string
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Failed to fetch bouquet:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
