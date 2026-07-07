/** A unit of work belonging to exactly one project (via `projectId`). */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  done: boolean;
}
