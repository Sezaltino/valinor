import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <div class="welcome-card">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Bem-vindo ao Kanban Board!</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <p>Sistema de gerenciamento de projetos em desenvolvimento.</p>

            <div class="features">
              <h3>Funcionalidades:</h3>
              <ul>
                <li>📋 Gerenciamento de Boards</li>
                <li>✅ Tasks organizadas</li>
                <li>🎨 Interface moderna</li>
                <li>📱 Design responsivo</li>
              </ul>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/boards">
              <mat-icon>dashboard</mat-icon>
              Ver Boards
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .welcome-card {
      max-width: 500px;
      width: 100%;
    }

    .features {
      margin-top: 16px;
    }

    .features h3 {
      color: #333;
      margin-bottom: 8px;
    }

    .features ul {
      list-style: none;
      padding-left: 0;
    }

    .features li {
      padding: 4px 0;
      font-size: 0.95rem;
    }

    mat-card-actions {
      padding-top: 16px;
    }

    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class HomeComponent { }
