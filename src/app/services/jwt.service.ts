import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private static readonly USER_TOKEN_ID: string = 'USER_JWT_TOKEN';
  constructor() { }

  public setToken(jwt: string): void {
    localStorage.setItem(JwtService.USER_TOKEN_ID, jwt);

  }
  public getToken(): string {
    const token: string | null = localStorage.getItem(JwtService.USER_TOKEN_ID);
    if (!token) {
      return '';
    }
    return token;
  }

  public removeToken(): void {
    localStorage.removeItem(JwtService.USER_TOKEN_ID);
  }


}
