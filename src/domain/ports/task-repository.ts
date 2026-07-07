import type { Task } from '../task';

export interface CreateTaskInput {
  projectId: string;
  title: string;
}

export interface UpdateTaskInput {
  title?: string;
  done?: boolean;
}

/** The persistence port for tasks. Application logic depends only on this. */
export interface TaskRepository {
  create(input: CreateTaskInput): Promise<Task>;
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  update(id: string, patch: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
}
