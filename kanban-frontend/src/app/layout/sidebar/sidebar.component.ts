import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar-header">
      <mat-icon class="logo">dashboard</mat-icon>
      <h2>Kanban</h2>
    </div>

    <mat-nav-list class="nav-list">
      <mat-list-item routerLink="/boards" routerLinkActive="active">
        <mat-icon matListItemIcon>view_kanban</mat-icon>
        <span matListItemTitle>My Boards</span>
      </mat-list-item>
    </mat-nav-list>
  `,
  styles: [`
    .sidebar-header {
      display: flex;
      align-items: center;
      padding: 24px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .logo {
      color: #1976d2;
      font-size: 2rem;
      margin-right: 12px;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .nav-list {
      padding-top: 16px;
    }

    mat-list-item {
      margin: 4px 16px;
      border-radius: 8px;
      transition: all 0.2s ease-in-out;
    }

    mat-list-item:hover {
      background-color: rgba(25, 118, 210, 0.08);
    }

    mat-list-item.active {
      background-color: rgba(25, 118, 210, 0.12);
      color: #1976d2;
    }
  `]
})
export class SidebarComponent { }
