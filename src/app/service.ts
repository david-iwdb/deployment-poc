import type { Project } from '../domain/project';
import type { Task } from '../domain/task';
import type { CreateProjectInput, ProjectRepository } from '../domain/ports/project-repository';
import type {
  CreateTaskInput,
  TaskRepository,
  UpdateTaskInput,
} from '../domain/ports/task-repository';

/** The application's use cases. The API depends on this, not on the adapters. */
export interface AppService {
  createProject(input: CreateProjectInput): Promise<Project>;
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  deleteProject(id: string): Promise<void>;
  createTask(input: CreateTaskInput): Promise<Task>;
  listTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  updateTask(id: string, patch: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export interface ServiceDependencies {
  projects: ProjectRepository;
  tasks: TaskRepository;
}

export function createAppService({ projects, tasks }: ServiceDependencies): AppService {
  return {
    createProject: (input) => projects.create(input),
    listProjects: () => projects.getAll(),
    getProject: (id) => projects.getById(id),
    deleteProject: (id) => projects.delete(id),
    createTask: (input) => tasks.create(input),
    listTasks: () => tasks.getAll(),
    getTask: (id) => tasks.getById(id),
    updateTask: (id, patch) => tasks.update(id, patch),
    deleteTask: (id) => tasks.delete(id),
  };
}
