import Fastify, { type FastifyInstance } from 'fastify';
import type { AppService } from '../app/service';
import { ForeignKeyViolationError, NotFoundError } from '../domain/errors';

/**
 * Builds the composed HTTP application from an injected service. The API layer
 * knows nothing about which persistence adapter backs the service.
 */
export function createApp(service: AppService): FastifyInstance {
  const app = Fastify({ logger: false });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message });
    }
    if (error instanceof ForeignKeyViolationError) {
      return reply.status(409).send({ error: error.message });
    }
    app.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  });

  app.get('/health', async () => ({ status: 'ok' }));

  // Projects
  app.post<{ Body: { name?: string } }>('/projects', async (request, reply) => {
    if (!request.body?.name) {
      return reply.status(400).send({ error: 'name is required' });
    }
    const project = await service.createProject({ name: request.body.name });
    return reply.status(201).send(project);
  });

  app.get('/projects', () => service.listProjects());

  app.get<{ Params: { id: string } }>('/projects/:id', async (request, reply) => {
    const project = await service.getProject(request.params.id);
    if (!project) {
      return reply.status(404).send({ error: 'project not found' });
    }
    return project;
  });

  app.delete<{ Params: { id: string } }>('/projects/:id', async (request, reply) => {
    await service.deleteProject(request.params.id);
    return reply.status(204).send();
  });

  // Tasks
  app.post<{ Body: { projectId?: string; title?: string } }>('/tasks', async (request, reply) => {
    if (!request.body?.projectId || !request.body?.title) {
      return reply.status(400).send({ error: 'projectId and title are required' });
    }
    const task = await service.createTask({
      projectId: request.body.projectId,
      title: request.body.title,
    });
    return reply.status(201).send(task);
  });

  app.get('/tasks', () => service.listTasks());

  app.get<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const task = await service.getTask(request.params.id);
    if (!task) {
      return reply.status(404).send({ error: 'task not found' });
    }
    return task;
  });

  app.patch<{ Params: { id: string }; Body: { title?: string; done?: boolean } }>(
    '/tasks/:id',
    (request) => service.updateTask(request.params.id, request.body ?? {}),
  );

  app.delete<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    await service.deleteTask(request.params.id);
    return reply.status(204).send();
  });

  return app;
}
