import { registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Status possíveis para uma tarefa',
});
