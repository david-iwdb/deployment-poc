import Fastify, { type FastifyInstance } from 'fastify';

/**
 * Builds the composed HTTP application. As the project grows, this is where
 * routes are registered against injected dependencies. For the walking
 * skeleton it exposes a single health check.
 */
export function createApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}
