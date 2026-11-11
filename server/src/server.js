import Fastify from 'fastify';
import { db } from './db.js';
import { authRoutes, currentUser } from './auth.js';
import { catalogRoutes } from './routes/catalog.js';
import { selectionRoutes } from './routes/selections.js';
import { profileRoutes } from './routes/profile.js';
import { adminRoutes } from './routes/admin.js';
import { healthRoutes } from './routes/health.js';

const app = Fastify({
  logger: { level: process.env.LOG_LEVEL || 'info' },
  bodyLimit: 1024 * 1024
});

app.decorateRequest('user', null);

app.addHook('onRequest', async (req, reply) => {
  reply.header('access-control-allow-origin', '*');
  reply.header('access-control-allow-headers', 'content-type, authorization, x-ops-token');
  reply.header('access-control-allow-methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  reply.header('x-content-type-options', 'nosniff');
  if (req.method === 'OPTIONS') {
    reply.code(204).send();
  }
});

app.addHook('preHandler', async (req) => {
  if (req.method !== 'OPTIONS') req.user = currentUser(req);
});

app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, 'request failed');
  const code = err.statusCode >= 400 && err.statusCode < 500 ? err.statusCode : 500;
  reply.code(code).send({
    error: code === 500 ? 'internal_error' : 'bad_request',
    message: code === 500 ? '服务器内部错误' : err.message
  });
});

app.register(healthRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api/auth' });
app.register(catalogRoutes, { prefix: '/api' });
app.register(selectionRoutes, { prefix: '/api' });
app.register(profileRoutes, { prefix: '/api' });
app.register(adminRoutes, { prefix: '/api/admin' });

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, async () => {
    app.log.info({ signal }, 'shutting down');
    try {
      await app.close();
      db.close();
    } finally {
      process.exit(0);
    }
  });
}

start();
