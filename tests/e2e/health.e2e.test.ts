import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../../src/api/server';

describe('GET /health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responds with 200 and status ok', async () => {
    const response = await request(app.server).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
