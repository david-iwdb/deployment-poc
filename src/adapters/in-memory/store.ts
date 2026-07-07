import type { Project } from '../../domain/project';
import type { Task } from '../../domain/task';

/**
 * A single shared store both in-memory adapters operate on. Sharing one store
 * mirrors the real adapters sharing one database connection, and is what lets
 * the fake enforce cross-table referential integrity.
 */
export interface InMemoryStore {
  projects: Map<string, Project>;
  tasks: Map<string, Task>;
}

export function createInMemoryStore(): InMemoryStore {
  return { projects: new Map(), tasks: new Map() };
}
