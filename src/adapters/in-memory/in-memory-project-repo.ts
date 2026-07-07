import { randomUUID } from 'node:crypto';
import type { Project } from '../../domain/project';
import type { CreateProjectInput, ProjectRepository } from '../../domain/ports/project-repository';
import { ForeignKeyViolationError, NotFoundError } from '../../domain/errors';
import type { InMemoryStore } from './store';

/**
 * In-memory (map-backed) implementation of {@link ProjectRepository}, used in
 * the development environment. It deliberately enforces the same referential
 * integrity the real database will, by refusing to delete a project that still
 * has tasks.
 */
export class InMemoryProjectRepository implements ProjectRepository {
  constructor(private readonly store: InMemoryStore) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const project: Project = { id: randomUUID(), name: input.name };
    this.store.projects.set(project.id, project);
    return project;
  }

  async getAll(): Promise<Project[]> {
    return [...this.store.projects.values()];
  }

  async getById(id: string): Promise<Project | null> {
    return this.store.projects.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    if (!this.store.projects.has(id)) {
      throw new NotFoundError('Project', id);
    }
    const hasTasks = [...this.store.tasks.values()].some((task) => task.projectId === id);
    if (hasTasks) {
      throw new ForeignKeyViolationError(
        `Cannot delete project "${id}" because it still has tasks`,
      );
    }
    this.store.projects.delete(id);
  }
}
