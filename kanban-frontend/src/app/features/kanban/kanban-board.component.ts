// ============================================
// CRIAR: src/app/features/kanban/kanban-board.component.ts
// ============================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from './create-task-dialog.component';
import { EditTaskDialogComponent } from './edit-task-dialog.component';
import { Board, Task, TaskStatus, Priority } from '../../core/types/api.types';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DragDropModule,
    MatDialogModule
  ],
template: `
  <div class="kanban-container" *ngIf="!loading; else loadingTemplate">
    <div class="kanban-header">
      <div class="header-left">
        <button mat-icon-button routerLink="/boards" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ board?.name || 'Kanban Board' }}</h1>
      </div>

      <button mat-raised-button color="primary" (click)="createTask()">
        <mat-icon>add</mat-icon>
        New Task
      </button>
    </div>

    <div class="kanban-board">
      <div class="kanban-column" *ngFor="let column of columns; trackBy: trackByColumn">
        <div class="column-header">
          <h3>{{ column.title }}</h3>
          <span class="task-count">{{ column.tasks.length }}</span>
        </div>

        <div
          class="column-content"
          cdkDropList
          [id]="'column-' + column.id"
          [cdkDropListData]="column.tasks"
          [cdkDropListConnectedTo]="getConnectedLists()"
          (cdkDropListDropped)="onTaskDrop($event)">

          <div
            class="task-card"
            *ngFor="let task of column.tasks; trackBy: trackByTask"
            cdkDrag
            [cdkDragData]="task"
            (click)="editTask(task)"
            (cdkDragStarted)="onDragStarted(task)"
            (cdkDragEnded)="onDragEnded()">

            <div class="task-header">
              <span class="task-title">{{ task.title }}</span>
              <mat-chip
                class="priority-chip"
                [ngClass]="'priority-' + task.priority.toLowerCase()">
                {{ task.priority }}
              </mat-chip>
            </div>

            <p class="task-description" *ngIf="task.description">
              {{ task.description }}
            </p>

            <div class="task-footer">
              <span class="task-date" *ngIf="task.dueDate">
                Due: {{ task.dueDate | date:'MMM dd' }}
              </span>
              <mat-icon class="edit-indicator">edit_note</mat-icon>
            </div>

            <!-- Preview do drag -->
            <div *cdkDragPreview class="drag-preview">
              <div class="task-preview">
                <span class="preview-title">{{ task.title }}</span>
                <mat-chip class="preview-priority"
                  [ngClass]="'priority-' + task.priority.toLowerCase()">
                  {{ task.priority }}
                </mat-chip>
              </div>
            </div>
          </div>

          <div class="empty-column" *ngIf="column.tasks.length === 0">
            <mat-icon>inbox</mat-icon>
            <p>No tasks</p>
            <span class="drop-hint">Drop tasks here</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ng-template #loadingTemplate>
    <div class="loading-container">
      <mat-spinner></mat-spinner>
      <p>Loading kanban board...</p>
    </div>
  </ng-template>
`,
  styles: [`
    .kanban-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      background: #ffffff;
      border-bottom: 1px solid #e1e5e9;
      min-height: 88px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .kanban-header button[mat-raised-button] {
      height: 48px;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 12px;
      letter-spacing: 0.025em;
      text-transform: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      transition: all 0.2s ease;
    }
    .kanban-header button[mat-raised-button]:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
    }
    .kanban-header button[mat-raised-button] mat-icon {
      font-size: 18px;
      margin-right: 8px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-left h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a202c;
      letter-spacing: -0.025em;
    }

    .back-button {
      color: #718096;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .back-button:hover {
      color: #2d3748;
      background-color: #f7fafc;
    }
    .back-button mat-icon {
      font-size: 20px;
    }
    .kanban-board {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding: 24px;
      overflow-x: auto;
    }

    .kanban-column {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      min-height: 500px;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .column-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .task-count {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .column-content {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 200px;
    }
    .task-card {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      cursor: pointer;  /* Mudança: sempre pointer */
      transition: all 0.2s ease-in-out;
    }

    .task-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transform: translateY(-1px);
      border-color: #1976d2;  /* Adicionar borda azul no hover */
    }

    .edit-indicator {
      font-size: 1rem;
      color: #999;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    .task-card:hover .edit-indicator {
      opacity: 1;
      color: #1976d2;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-card {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      cursor: grab;
      transition: all 0.2s ease-in-out;
    }

    .task-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transform: translateY(-1px);
    }

    .task-card.cdk-drag-dragging {
      cursor: grabbing;
      transform: rotate(5deg);
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;
    }

    .task-title {
      font-weight: 600;
      color: #333;
      line-height: 1.3;
    }

    .priority-chip {
      font-size: 0.7rem;
      height: 20px;
      line-height: 20px;
    }

    .priority-low { background: #e8f5e8; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #d32f2f; }
    .priority-urgent { background: #fce4ec; color: #c2185b; }

    .task-description {
      font-size: 0.875rem;
      color: #666;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-date {
      font-size: 0.75rem;
      color: #999;
    }

    .task-menu {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }

    .empty-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: #999;
      text-align: center;
    }

    .empty-column mat-icon {
      font-size: 2rem;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 16px;
    }

    .cdk-drop-list-dragging .task-card:not(.cdk-drag-dragging) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
      .kanban-board {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 16px;
      }
    }

    @media (max-width: 480px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class KanbanBoardComponent implements OnInit {
  board: Board | null = null;
  loading = true;

  columns = [
    { id: 'TODO', title: 'To Do', tasks: [] as Task[] },
    { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] as Task[] },
    { id: 'REVIEW', title: 'Review', tasks: [] as Task[] },
    { id: 'DONE', title: 'Done', tasks: [] as Task[] }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
      this.loadTasks(boardId);
    }
  }

  loadBoard(boardId: string) {
    const query = `
      query GetBoard($id: ID!) {
        board(id: $id) {
          id
          name
          description
          color
          ownerId
        }
      }
    `;

    this.http.post('http://localhost:3000/graphql', {
      query,
      variables: { id: boardId }
    }).subscribe({
      next: (response: any) => {
        if (response.data?.board) {
          this.board = response.data.board;
        } else {
          console.error('Board not found');
          this.router.navigate(['/boards']);
        }
      },
      error: (error) => {
        console.error('Error loading board:', error);
        this.router.navigate(['/boards']);
      }
    });
  }
  loadTasks(boardId: string) {
    const query = `
      query GetTasksByBoard($boardId: ID!) {
        tasksByBoard(boardId: $boardId) {
          id
          title
          description
          status
          priority
          dueDate
          position
          boardId
          assigneeId
        }
      }
    `;

    this.http.post('http://localhost:3000/graphql', {
      query,
      variables: { boardId }
    }).subscribe({
      next: (response: any) => {
        this.organizeTasks(response.data.tasksByBoard);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  organizeTasks(tasks: Task[]) {
    // Limpar colunas
    this.columns.forEach(column => column.tasks = []);

    // Organizar tasks por status
    tasks.forEach(task => {
      const column = this.columns.find(col => col.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });

    // Ordenar tasks por posição
    this.columns.forEach(column => {
      column.tasks.sort((a, b) => a.position - b.position);
    });
  }

  getConnectedLists(): string[] {
    return this.columns.map(column => `column-${column.id}`);
  }

onTaskDrop(event: CdkDragDrop<Task[]>) {
  console.log('Drag drop event:', event);

  if (event.previousContainer === event.container) {
    // Mover dentro da mesma coluna - apenas reordenar
    console.log('Moving within same column');
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // TODO: Aqui você pode implementar reordenação no backend se quiser

  } else {
    // Mover entre colunas diferentes
    console.log('Moving between columns');

    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = this.getStatusFromColumnId(event.container.id);

    console.log(`Moving task "${task.title}" to ${newStatus}`);

    // Atualizar localmente primeiro (para UX imediato)
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Atualizar task status localmente
    task.status = newStatus;

    // Atualizar no backend
    this.moveTaskInBackend(task.id, newStatus).subscribe({
      next: (response) => {
        console.log('Task moved successfully in backend:', response);
      },
      error: (error) => {
        console.error('Error moving task in backend:', error);

        // REVERTER mudança local em caso de erro
        const currentColumnIndex = this.columns.findIndex(col => col.id === newStatus);
        const previousColumnIndex = this.columns.findIndex(col =>
          col.id === event.previousContainer.id
        );

        if (currentColumnIndex !== -1 && previousColumnIndex !== -1) {
          // Reverter o movimento
          transferArrayItem(
            this.columns[currentColumnIndex].tasks,
            this.columns[previousColumnIndex].tasks,
            event.currentIndex,
            event.previousIndex
          );

          // Reverter status
          task.status = event.previousContainer.id as TaskStatus;
        }

        alert('Failed to move task. Please try again.');
      }
    });
  }
}



  getStatusFromColumnId(columnId: string): TaskStatus {
    return columnId as TaskStatus;
  }

  moveTaskInBackend(taskId: string, newStatus: TaskStatus) {
    const mutation = `
      mutation MoveTask($id: ID!, $status: TaskStatus!) {
        moveTask(id: $id, status: $status) {
          id
          status
          position
          updatedAt
        }
      }
    `;

    return this.http.post('http://localhost:3000/graphql', {
      query: mutation,
      variables: { id: taskId, status: newStatus }
    });
  }
  trackByColumn(index: number, column: any): string {
    return column.id;
  }

  trackByTask(index: number, task: Task): string {
    return task.id;
  }
  onDragStarted(task: Task) {
  console.log('Drag started:', task.title);
  // Adicionar classe CSS para indicar que está arrastando
  document.body.classList.add('is-dragging');
  }

  onDragEnded() {
    console.log('Drag ended');
    // Remover classe CSS
    document.body.classList.remove('is-dragging');
  }

  createTask() {
    if (!this.board) {
      console.error('Board not loaded');
      return;
    }

    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      data: {
        boardId: this.board.id,
        boardName: this.board.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New task created:', result);
        // Recarregar tasks para mostrar a nova task
        this.loadTasks(this.board!.id);
      }
    });
  }


editTask(task: Task) {
  const dialogRef = this.dialog.open(EditTaskDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    disableClose: false,
    data: { task }
  });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Task dialog result:', result);

        switch (result.action) {
          case 'updated':
            console.log('Task updated:', result.task);
            // Recarregar tasks para mostrar mudanças
            this.loadTasks(this.board!.id);
            break;

          case 'moved':
            console.log('Task moved:', result.task);
            // Recarregar tasks para atualizar colunas
            this.loadTasks(this.board!.id);
            break;

          case 'deleted':
            console.log('Task deleted:', result.taskId);
            // Recarregar tasks para remover da lista
            this.loadTasks(this.board!.id);
            break;
        }
      }
    });
  }
}
