import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create-board-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
template: `
  <h1 mat-dialog-title>Create New Board</h1>

  <div mat-dialog-content>
    <form class="board-form">
      <mat-form-field class="full-width">
        <mat-label>Board Name</mat-label>
        <input
          matInput
          [(ngModel)]="boardData.name"
          name="boardName"
          placeholder="Enter board name"
          maxlength="50">
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Description (Optional)</mat-label>
        <textarea
          matInput
          [(ngModel)]="boardData.description"
          name="boardDescription"
          placeholder="Describe your board"
          rows="3"
          maxlength="200">
        </textarea>
      </mat-form-field>

      <div class="color-section">
        <label class="color-label">Board Color</label>
        <div class="color-picker">
          <div
            *ngFor="let color of availableColors"
            class="color-option"
            [class.selected]="boardData.color === color.value"
            [style.background-color]="color.value"
            (click)="selectColor(color.value)">
          </div>
        </div>
      </div>
    </form>
  </div>

    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!boardData.name.trim() || isSubmitting">
        <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
        <span *ngIf="!isSubmitting">Create Board</span>
      </button>
    </div>
  `,
  styles: [`
    .board-form {
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .color-section {
      margin-top: 16px;
    }

    .color-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(0,0,0,0.6);
      margin-bottom: 8px;
    }

    .color-picker {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .color-option {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
      border: 2px solid transparent;
    }

    .color-option:hover {
      transform: scale(1.1);
    }

    .color-option.selected {
      border-color: rgba(0,0,0,0.3);
      transform: scale(1.1);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .dialog-actions button {
      min-width: 100px;
    }
  `]
})
export class CreateBoardDialogComponent {
  boardData = {
    name: '',
    description: '',
    color: '#1976d2'
  };

  isSubmitting = false;

  availableColors = [
    { name: 'Blue', value: '#1976d2' },
    { name: 'Green', value: '#388e3c' },
    { name: 'Orange', value: '#f57c00' },
    { name: 'Purple', value: '#7b1fa2' },
    { name: 'Red', value: '#d32f2f' },
    { name: 'Teal', value: '#00796b' }
  ];

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<CreateBoardDialogComponent>
  ) {}

  selectColor(color: string) {
    this.boardData.color = color;
  }

  onSubmit() {
    if (this.boardData.name.trim() && !this.isSubmitting) {
      this.isSubmitting = true;

      const mutation = `
        mutation CreateBoard($input: CreateBoardInput!) {
          createBoard(input: $input) {
            id
            name
            description
            color
            ownerId
            createdAt
            updatedAt
          }
        }
      `;

      const variables = {
        input: {
          name: this.boardData.name.trim(),
          description: this.boardData.description.trim() || null,
          color: this.boardData.color,
          ownerId: '1' // Mock user ID
        }
      };

      this.http.post('http://localhost:3000/graphql', { query: mutation, variables })
        .subscribe({
          next: (response: any) => {
            console.log('Board created:', response.data.createBoard);
            this.dialogRef.close(response.data.createBoard);
          },
          error: (error) => {
            console.error('Error creating board:', error);
            this.isSubmitting = false;
          }
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
