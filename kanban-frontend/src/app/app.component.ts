import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>Kanban Board</h1>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: #1976d2;
      color: white;
      padding: 16px 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'Kanban Frontend';
}
