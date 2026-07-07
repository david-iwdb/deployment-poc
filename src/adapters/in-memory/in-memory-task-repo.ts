import { randomUUID } from 'node:crypto';
import type { Task } from '../../domain/task';
import type {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from '../../domain/ports/task-repository';
import { ForeignKeyViolationError, NotFoundError } from '../../domain/errors';
import type { InMemoryStore } from './store';

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private readonly store: InMemoryStore) {}

  async create(input: CreateTaskInput): Promise<Task> {
    if (!this.store.projects.has(input.projectId)) {
      throw new ForeignKeyViolationError(
        `Cannot create task for unknown project "${input.projectId}"`,
      );
    }
    const task: Task = {
      id: randomUUID(),
      projectId: input.projectId,
      title: input.title,
      done: false,
    };
    this.store.tasks.set(task.id, task);
    return task;
  }

  async getAll(): Promise<Task[]> {
    return [...this.store.tasks.values()];
  }

  async getById(id: string): Promise<Task | null> {
    return this.store.tasks.get(id) ?? null;
  }

  async update(id: string, patch: UpdateTaskInput): Promise<Task> {
    const existing = this.store.tasks.get(id);
    if (!existing) {
      throw new NotFoundError('Task', id);
    }
    const updated: Task = {
      ...existing,
      title: patch.title ?? existing.title,
      done: patch.done ?? existing.done,
    };
    this.store.tasks.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    if (!this.store.tasks.has(id)) {
      throw new NotFoundError('Task', id);
    }
    this.store.tasks.delete(id);
  }
}
