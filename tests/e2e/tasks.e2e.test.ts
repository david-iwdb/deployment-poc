import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { composeApp } from '../../src/compose';

describe('Project + Task API (development)', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = composeApp('development');
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  async function createProject(name = 'Alpha'): Promise<{ id: string; name: string }> {
    const response = await request(app.server).post('/projects').send({ name });
    expect(response.status).toBe(201);
    return response.body as { id: string; name: string };
  }

  it('creates and lists projects', async () => {
    const project = await createProject('Alpha');
    expect(project.id).toBeTruthy();
    expect(project.name).toBe('Alpha');

    const list = await request(app.server).get('/projects');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('rejects a project without a name', async () => {
    const response = await request(app.server).post('/projects').send({});
    expect(response.status).toBe(400);
  });

  it('creates, reads, updates and deletes a task under a project', async () => {
    const project = await createProject();

    const created = await request(app.server)
      .post('/tasks')
      .send({ projectId: project.id, title: 'write tests' });
    expect(created.status).toBe(201);
    const task = created.body as { id: string; done: boolean };
    expect(task.done).toBe(false);

    const fetched = await request(app.server).get(`/tasks/${task.id}`);
    expect(fetched.status).toBe(200);

    const updated = await request(app.server).patch(`/tasks/${task.id}`).send({ done: true });
    expect(updated.status).toBe(200);
    expect((updated.body as { done: boolean }).done).toBe(true);

    const deleted = await request(app.server).delete(`/tasks/${task.id}`);
    expect(deleted.status).toBe(204);

    const missing = await request(app.server).get(`/tasks/${task.id}`);
    expect(missing.status).toBe(404);
  });

  it('returns 409 when creating a task for an unknown project', async () => {
    const response = await request(app.server)
      .post('/tasks')
      .send({ projectId: 'does-not-exist', title: 'orphan' });
    expect(response.status).toBe(409);
  });

  it('returns 409 when deleting a project that still has tasks', async () => {
    const project = await createProject();
    await request(app.server).post('/tasks').send({ projectId: project.id, title: 'blocker' });

    const response = await request(app.server).delete(`/projects/${project.id}`);
    expect(response.status).toBe(409);
  });

  it('returns 404 when updating an unknown task', async () => {
    const response = await request(app.server).patch('/tasks/does-not-exist').send({ done: true });
    expect(response.status).toBe(404);
  });
});
