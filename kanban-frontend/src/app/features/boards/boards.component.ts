// src/app/features/boards/boards.component.ts
// SUBSTITUIR TODO O ARQUIVO COMPLETAMENTE:

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Board } from '../../core/types/api.types';
import { CreateBoardDialogComponent } from './create-board-dialog/create-board-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="boards-container">
      <div class="header-section">
        <h1>My Boards</h1>
        <button
          mat-mini-fab
          color="primary"
          class="create-button"
          (click)="openCreateDialog()">
          <mat-icon>+</mat-icon>
        </button>
      </div>

      <div class="boards-content" *ngIf="!loading; else loadingTemplate">
        <div class="boards-grid" *ngIf="boards.length > 0; else emptyState">
            <mat-card
              *ngFor="let board of boards; trackBy: trackByBoardId"
              class="board-card"
              [style.border-left]="'4px solid ' + board.color"
              (click)="openBoard(board, $event)">

            <mat-card-header>
              <mat-card-title>{{ board.name }}</mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <p *ngIf="board.description; else noDescription" class="description">
                {{ board.description }}
              </p>
              <ng-template #noDescription>
                <p class="no-description">No description</p>
              </ng-template>
            </mat-card-content>

            <mat-card-actions>
              <span class="created-date">
                Created {{ board.createdAt | date:'MMM dd, yyyy' }}
              </span>
            </mat-card-actions>
          </mat-card>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <mat-icon class="empty-icon">view_kanban</mat-icon>
            <h2>No boards yet</h2>
            <p>Lista de boards carregada com sucesso!</p>
            <!-- REMOVIDO BOTÃO CREATE TEMPORARIAMENTE -->
          </div>
        </ng-template>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading boards...</p>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    .boards-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }
      :host {
  display: block;
}

    /* Garante que o header seja a referência de layout */
    .header-section {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Não deixa o botão “crescer” no flex */
    .header-section .create-button {
      flex: 0 0 auto;
    }

    /* Evita interferência de regras globais em <button> */
    .header-section .create-button.mat-mdc-mini-fab,
    .header-section .create-button.mdc-fab {
      /* nada de width/height custom aqui – deixe o Material controlar */
      line-height: normal; /* neutraliza line-height global se houver */
    }

    /* Ícone central e do tamanho correto mesmo se houver resets globais */
    .header-section .create-button .mat-icon {
      width: 24px;
      height: 24px;
      font-size: 24px;
      line-height: 24px;
      display: inline-block;
    }


    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-section h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }

    .boards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .board-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.16);
    }

    .description {
      color: #666;
      margin-bottom: 16px;
    }

    .no-description {
      color: #999;
      font-style: italic;
      margin-bottom: 16px;
    }

    .created-date {
      font-size: 0.75rem;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
    }

    .empty-icon {
      font-size: 4rem;
      color: #bdbdbd;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      gap: 16px;
    }

    .loading-container p {
      color: #666;
      font-size: 0.95rem;
    }
  `]
})
export class BoardsComponent implements OnInit {
  boards: Board[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.loading = true;

    const query = `
      query GetBoards {
        boards {
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

    this.http.post('http://localhost:3000/graphql', { query })
      .subscribe({
        next: (response: any) => {
          this.boards = response.data.boards;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading boards:', error);
          this.loading = false;
        }
      });
  }

openCreateDialog() {
  console.log('Abrindo dialog para criar board...');

  // Verificar se já tem dialog aberto
  if (this.dialog.openDialogs.length > 0) {
    console.log('Já existe um dialog aberto, cancelando...');
    return;
  }

  const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
    width: '500px',
    disableClose: false,
    hasBackdrop: true,
    panelClass: 'create-board-dialog'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog fechado, resultado:', result);
    if (result) {
      this.loadBoards();
    }
  });
}
  openBoard(board: Board, event: Event) {
    event.stopPropagation();
    console.log('Navegando para kanban board:', board.name, board.id);
    this.router.navigate(['/boards', board.id]);
  }
  trackByBoardId(index: number, board: Board): string {
    return board.id;
  }

  // NENHUM MÉTODO DE DIALOG POR ENQUANTO
}
