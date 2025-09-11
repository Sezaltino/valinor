// src/app/core/types/api.types.ts
// SUBSTITUIR TODO O CONTEÚDO por este código completo:

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ADICIONAR o tipo Task que estava faltando:
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  position: number;
  boardId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBoardInput {
  name: string;
  description?: string;
  color?: string;
  ownerId: string;
}

// ADICIONAR outros inputs que podem ser necessários:
export interface CreateTaskInput {
  title: string;
  description?: string;
  boardId: string;
  assigneeId?: string;
  priority?: Priority;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  assigneeId?: string;
}
