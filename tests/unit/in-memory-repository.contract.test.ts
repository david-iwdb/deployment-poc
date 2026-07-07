import { runRepositoryContract } from '../contract/repository.contract';
import { createInMemoryStore } from '../../src/adapters/in-memory/store';
import { InMemoryProjectRepository } from '../../src/adapters/in-memory/in-memory-project-repo';
import { InMemoryTaskRepository } from '../../src/adapters/in-memory/in-memory-task-repo';

runRepositoryContract('in-memory', () => {
  const store = createInMemoryStore();
  return {
    projects: new InMemoryProjectRepository(store),
    tasks: new InMemoryTaskRepository(store),
  };
});
