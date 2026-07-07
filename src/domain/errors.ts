/** Thrown when an entity is looked up by id but does not exist. */
export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" was not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when an operation would violate referential integrity — e.g. creating
 * a task for a project that does not exist, or deleting a project that still
 * has tasks. The in-memory fake enforces this deliberately so it behaves the
 * same as the real database will.
 */
export class ForeignKeyViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForeignKeyViolationError';
  }
}
