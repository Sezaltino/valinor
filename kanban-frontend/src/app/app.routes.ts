import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'boards',
    loadComponent: () => import('./features/boards/boards.component').then(m => m.BoardsComponent)
  },
  {
    path: 'boards/:id',
    loadComponent: () => import('./features/kanban/kanban-board.component').then(m => m.KanbanBoardComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
