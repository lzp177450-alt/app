import { db } from '../db.js';

const started = Date.now();

export async function healthRoutes(app) {
  app.get('/health', async (req, reply) => {
    try {
      const row = db.prepare('SELECT COUNT(*) AS n FROM products').get();
      return {
        ok: true,
        service: 'shili-api',
        version: process.env.APP_VERSION || 'dev',
        products: row.n,
        uptime: Math.round((Date.now() - started) / 1000),
        time: new Date().toISOString()
      };
    } catch (err) {
      return reply.code(503).send({ ok: false, error: err.message });
    }
  });
}
