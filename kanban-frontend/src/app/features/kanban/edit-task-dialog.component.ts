// ============================================
// CRIAR: src/app/features/kanban/edit-task-dialog.component.ts
// ============================================

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Task, Priority, TaskStatus, UpdateTaskInput } from '../../core/types/api.types';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-header">
      <div class="header-content">
        <div class="header-title">
          <mat-icon class="header-icon">edit_note</mat-icon>
          <h1>Edit Task</h1>
        </div>
        <button mat-icon-button [matMenuTriggerFor]="taskMenu" class="header-menu">
          <mat-icon>more_vert</mat-icon>
        </button>
      </div>

      <mat-menu #taskMenu="matMenu" class="task-menu">
        <button mat-menu-item (click)="moveToColumn('TODO')">
          <mat-icon>assignment</mat-icon>
          <span>Move to To Do</span>
        </button>
        <button mat-menu-item (click)="moveToColumn('IN_PROGRESS')">
          <mat-icon>work</mat-icon>
          <span>Move to In Progress</span>
        </button>
        <button mat-menu-item (click)="moveToColumn('REVIEW')">
          <mat-icon>rate_review</mat-icon>
          <span>Move to Review</span>
        </button>
        <button mat-menu-item (click)="moveToColumn('DONE')">
          <mat-icon>check_circle</mat-icon>
          <span>Move to Done</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="deleteTask()" class="delete-action">
          <mat-icon>delete</mat-icon>
          <span>Delete Task</span>
        </button>
      </mat-menu>
    </div>

    <mat-dialog-content class="dialog-content">
      <!-- resto do conteúdo igual -->
    </mat-dialog-content>

    <mat-dialog-actions class="dialog-actions">
      <!-- actions iguais -->
    </mat-dialog-actions>
  `,
  styles: [`
    .task-form {
      min-width: 500px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
    }

    .priority-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .priority-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .priority-low { background-color: #4caf50; }
    .priority-medium { background-color: #ff9800; }
    .priority-high { background-color: #f44336; }
    .priority-urgent { background-color: #e91e63; }

    .task-info {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #dee2e6;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 0.9rem;
      color: #495057;
      padding: 8px 0;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item mat-icon {
      font-size: 1.1rem;
      width: 20px;
      height: 20px;
      color: #6c757d;
      background: white;
      border-radius: 50%;
      padding: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 0 0 0;
      border-top: 1px solid #e9ecef;
      margin-top: 20px;
    }

    .dialog-actions button {
      min-width: 120px;
      height: 40px;
    }

    .dialog-actions button[mat-raised-button] {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    h1[mat-dialog-title] {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e9ecef;
      font-size: 1.4rem;
      color: #343a40;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .task-menu-button {
      width: 36px;
      height: 36px;
      line-height: 36px;
    }

    .delete-action {
      color: #dc3545;
    }

    .delete-action mat-icon {
      color: #dc3545;
    }

    /* Melhorar campos de formulário */
    mat-form-field {
      font-size: 0.95rem;
    }
    .dialog-header {
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a202c;
      letter-spacing: -0.025em;
    }

    .header-icon {
      color: #3b82f6;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .header-menu {
      color: #718096;
      width: 36px;
      height: 36px;
    }

    .header-menu:hover {
      background-color: #f7fafc;
      color: #2d3748;
    }

    .dialog-content {
      padding: 0 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    mat-form-field .mat-mdc-form-field-subscript-wrapper {
      margin-top: 4px;
    }

    /* Melhorar select de prioridade */
    .mat-mdc-select-value {
      display: flex;
      align-items: center;
    }

    @media (max-width: 600px) {
      .task-form {
        min-width: 300px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .task-info {
        padding: 16px;
        font-size: 0.85rem;
      }

      .info-item {
        gap: 8px;
        margin-bottom: 8px;
      }

      h1[mat-dialog-title] {
        font-size: 1.2rem;
      }
    }
  `]
})
export class EditTaskDialogComponent implements OnInit {
  taskData = {
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    dueDate: null as Date | null
  };

  isSubmitting = false;
  originalTask: Task;

  priorities = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' }
  ];

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.originalTask = data.task;
  }

  ngOnInit() {
    // Preencher formulário com dados da task
    this.taskData = {
      title: this.originalTask.title,
      description: this.originalTask.description || '',
      priority: this.originalTask.priority,
      dueDate: this.originalTask.dueDate ? new Date(this.originalTask.dueDate) : null
    };
  }

  onSave() {
    if (this.taskData.title?.trim() && !this.isSubmitting) {
      this.isSubmitting = true;

      const mutation = `
        mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
          updateTask(id: $id, input: $input) {
            id
            title
            description
            status
            priority
            dueDate
            position
            boardId
            assigneeId
            createdAt
            updatedAt
          }
        }
      `;

      const variables = {
        id: this.originalTask.id,
        input: {
          title: this.taskData.title.trim(),
          description: this.taskData.description?.trim() || null,
          priority: this.taskData.priority,
          dueDate: this.taskData.dueDate ? this.taskData.dueDate.toISOString() : null
        } as unknown as UpdateTaskInput
      };

      this.http.post('http://localhost:3000/graphql', {
        query: mutation,
        variables
      }).subscribe({
        next: (response: any) => {
          console.log('Task updated successfully:', response.data.updateTask);
          this.dialogRef.close({ action: 'updated', task: response.data.updateTask });
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  moveToColumn(newStatus: string) {
    const mutation = `
      mutation MoveTask($id: ID!, $status: TaskStatus!) {
        moveTask(id: $id, status: $status) {
          id
          status
        }
      }
    `;

    this.http.post('http://localhost:3000/graphql', {
      query: mutation,
      variables: { id: this.originalTask.id, status: newStatus }
    }).subscribe({
      next: (response: any) => {
        console.log('Task moved successfully:', response);
        this.dialogRef.close({ action: 'moved', task: response.data.moveTask });
      },
      error: (error) => {
        console.error('Error moving task:', error);
      }
    });
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      const mutation = `
        mutation DeleteTask($id: ID!) {
          deleteTask(id: $id)
        }
      `;

      this.http.post('http://localhost:3000/graphql', {
        query: mutation,
        variables: { id: this.originalTask.id }
      }).subscribe({
        next: (response: any) => {
          console.log('Task deleted successfully');
          this.dialogRef.close({ action: 'deleted', taskId: this.originalTask.id });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  getStatusLabel(status: TaskStatus): string {
    const statusLabels = {
      'TODO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'Review',
      'DONE': 'Done'
    };

    // Remover prefixo "column-" se existir
    const cleanStatus = status.toString().replace('column-', '');
    return statusLabels[cleanStatus as TaskStatus] || cleanStatus;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
