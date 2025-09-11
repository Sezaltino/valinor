// src/app/core/services/auth.service.ts
// SUBSTITUIR TODO O CONTEÚDO - SEM CÓDIGO DUPLICADO

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Mock user para teste - CONECTA COM SEU USER REAL DEPOIS
    this.currentUserSubject.next({
      id: '1',
      email: 'user@test.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
