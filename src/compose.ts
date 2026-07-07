import type { FastifyInstance } from 'fastify';
import { createApp } from './api/server';
import { createAppService, type ServiceDependencies } from './app/service';
import { createInMemoryStore } from './adapters/in-memory/store';
import { InMemoryProjectRepository } from './adapters/in-memory/in-memory-project-repo';
import { InMemoryTaskRepository } from './adapters/in-memory/in-memory-task-repo';

/**
 * The composition root: the single place that maps an environment to a concrete
 * set of adapters. Adding an environment is a new entry here, not a branch in
 * the application logic.
 */
const ADAPTERS: Record<string, () => ServiceDependencies> = {
  development: () => {
    const store = createInMemoryStore();
    return {
      projects: new InMemoryProjectRepository(store),
      tasks: new InMemoryTaskRepository(store),
    };
  },
};

export function composeApp(env: string = process.env.APP_ENV ?? 'development'): FastifyInstance {
  const makeDependencies = ADAPTERS[env];
  if (!makeDependencies) {
    throw new Error(
      `Unknown APP_ENV "${env}". Known environments: ${Object.keys(ADAPTERS).join(', ')}`,
    );
  }
  const service = createAppService(makeDependencies());
  return createApp(service);
}
