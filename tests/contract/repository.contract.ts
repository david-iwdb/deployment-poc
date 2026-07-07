import { beforeEach, describe, expect, it } from 'vitest';
import type { ProjectRepository } from '../../src/domain/ports/project-repository';
import type { TaskRepository } from '../../src/domain/ports/task-repository';
import { ForeignKeyViolationError, NotFoundError } from '../../src/domain/errors';

export interface RepositoriesUnderTest {
  projects: ProjectRepository;
  tasks: TaskRepository;
}

/**
 * The repository contract: one suite that every adapter must satisfy. It is run
 * against the in-memory adapter here and against the SQLite adapter in a later
 * slice, proving the two implementations honour the same behaviour.
 */
export function runRepositoryContract(
  description: string,
  makeRepositories: () => RepositoriesUnderTest,
): void {
  describe(`repository contract: ${description}`, () => {
    let repos: RepositoriesUnderTest;

    beforeEach(() => {
      repos = makeRepositories();
    });

    describe('projects', () => {
      it('creates and reads back a project', async () => {
        const created = await repos.projects.create({ name: 'Alpha' });

        expect(created.id).toBeTruthy();
        expect(created.name).toBe('Alpha');
        expect(await repos.projects.getById(created.id)).toEqual(created);
      });

      it('lists all projects', async () => {
        await repos.projects.create({ name: 'Alpha' });
        await repos.projects.create({ name: 'Beta' });

        expect(await repos.projects.getAll()).toHaveLength(2);
      });

      it('returns null for an unknown project', async () => {
        expect(await repos.projects.getById('missing')).toBeNull();
      });

      it('deletes a project that has no tasks', async () => {
        const project = await repos.projects.create({ name: 'Alpha' });

        await repos.projects.delete(project.id);

        expect(await repos.projects.getById(project.id)).toBeNull();
      });

      it('refuses to delete a project that still has tasks', async () => {
        const project = await repos.projects.create({ name: 'Alpha' });
        await repos.tasks.create({ projectId: project.id, title: 'do it' });

        await expect(repos.projects.delete(project.id)).rejects.toBeInstanceOf(
          ForeignKeyViolationError,
        );
      });
    });

    describe('tasks', () => {
      it('creates a task under an existing project', async () => {
        const project = await repos.projects.create({ name: 'Alpha' });

        const task = await repos.tasks.create({ projectId: project.id, title: 'do it' });

        expect(task.id).toBeTruthy();
        expect(task.projectId).toBe(project.id);
        expect(task.title).toBe('do it');
        expect(task.done).toBe(false);
      });

      it('refuses to create a task for an unknown project', async () => {
        await expect(
          repos.tasks.create({ projectId: 'missing', title: 'orphan' }),
        ).rejects.toBeInstanceOf(ForeignKeyViolationError);
      });

      it('updates a task title and done flag', async () => {
        const project = await repos.projects.create({ name: 'Alpha' });
        const task = await repos.tasks.create({ projectId: project.id, title: 'old' });

        const updated = await repos.tasks.update(task.id, { title: 'new', done: true });

        expect(updated.title).toBe('new');
        expect(updated.done).toBe(true);
      });

      it('throws when updating an unknown task', async () => {
        await expect(repos.tasks.update('missing', { done: true })).rejects.toBeInstanceOf(
          NotFoundError,
        );
      });

      it('deletes a task', async () => {
        const project = await repos.projects.create({ name: 'Alpha' });
        const task = await repos.tasks.create({ projectId: project.id, title: 'x' });

        await repos.tasks.delete(task.id);

        expect(await repos.tasks.getById(task.id)).toBeNull();
      });
    });
  });
}
