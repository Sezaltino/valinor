// ============================================
// CRIAR: src/app/features/kanban/create-task-dialog.component.ts
// ============================================

import { Component, Inject } from '@angular/core';
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

import { Priority, CreateTaskInput } from '../../core/types/api.types';

@Component({
  selector: 'app-create-task-dialog',
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
    MatIconModule
  ],
  template: `
    <h1 mat-dialog-title>
      <mat-icon>add_task</mat-icon>
      Create New Task
    </h1>

    <div mat-dialog-content>
      <form class="task-form">
        <mat-form-field class="full-width">
          <mat-label>Task Title</mat-label>
          <input
            matInput
            [(ngModel)]="taskData.title"
            name="taskTitle"
            placeholder="Enter task title"
            maxlength="100"
            required>
          <mat-hint align="end">{{taskData.title?.length || 0}}/100</mat-hint>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Description (Optional)</mat-label>
          <textarea
            matInput
            [(ngModel)]="taskData.description"
            name="taskDescription"
            placeholder="Describe the task details"
            rows="4"
            maxlength="500">
          </textarea>
          <mat-hint align="end">{{taskData.description?.length || 0}}/500</mat-hint>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field class="half-width">
            <mat-label>Priority</mat-label>
            <mat-select [(ngModel)]="taskData.priority" name="taskPriority">
              <mat-option *ngFor="let priority of priorities" [value]="priority.value">
                <div class="priority-option">
                  <span class="priority-indicator" [ngClass]="'priority-' + priority.value.toLowerCase()"></span>
                  {{ priority.label }}
                </div>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field class="half-width">
            <mat-label>Due Date (Optional)</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [(ngModel)]="taskData.dueDate"
              name="taskDueDate"
              placeholder="Choose date">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="board-info">
          <mat-icon>info</mat-icon>
          <span>Task will be created in "<strong>{{ boardName }}</strong>" board</span>
        </div>
      </form>
    </div>

    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!taskData.title?.trim() || isSubmitting">
        <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
        <mat-icon *ngIf="!isSubmitting">add_task</mat-icon>
        <span *ngIf="!isSubmitting">Create Task</span>
      </button>
    </div>
  `,
  styles: [`
    .task-form {
      min-width: 500px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
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

    .board-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 6px;
      margin-top: 16px;
      font-size: 0.875rem;
      color: #666;
    }

    .board-info mat-icon {
      color: #2196f3;
      font-size: 1.2rem;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }

    .dialog-actions button {
      min-width: 120px;
    }

    .dialog-actions button[mat-raised-button] {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h1[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    @media (max-width: 600px) {
      .task-form {
        min-width: 300px;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class CreateTaskDialogComponent {
  taskData = {
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    dueDate: null as Date | null
  };

  isSubmitting = false;
  boardName: string;
  boardId: string;

  priorities = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' }
  ];

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boardId: string, boardName: string }
  ) {
    this.boardId = data.boardId;
    this.boardName = data.boardName;
  }

  onSubmit() {
    if (this.taskData.title?.trim() && !this.isSubmitting) {
      this.isSubmitting = true;

      const mutation = `
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
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
        input: {
          title: this.taskData.title.trim(),
          description: this.taskData.description?.trim() || null,
          boardId: this.boardId,
          priority: this.taskData.priority,
          dueDate: this.taskData.dueDate ? this.taskData.dueDate.toISOString() : null,
          assigneeId: null // Por enquanto sem assignee
        } as unknown as CreateTaskInput
      };

      this.http.post('http://localhost:3000/graphql', {
        query: mutation,
        variables
      }).subscribe({
        next: (response: any) => {
          console.log('Task created successfully:', response.data.createTask);
          this.dialogRef.close(response.data.createTask);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isSubmitting = false;
          // TODO: Mostrar erro para o usuário
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
