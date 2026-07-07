import type { Project } from '../project';

export interface CreateProjectInput {
  name: string;
}

/** The persistence port for projects. Application logic depends only on this. */
export interface ProjectRepository {
  create(input: CreateProjectInput): Promise<Project>;
  getAll(): Promise<Project[]>;
  getById(id: string): Promise<Project | null>;
  delete(id: string): Promise<void>;
}
