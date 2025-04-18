import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthHelper {
  static isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token; // Retorna true se o token existir
  }
}
