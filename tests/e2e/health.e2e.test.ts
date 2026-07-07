import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { composeApp } from '../../src/compose';

describe('GET /health', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = composeApp('development');
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('responds with 200 and status ok', async () => {
    const response = await request(app.server).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
