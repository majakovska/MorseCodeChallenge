import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url = {
    postResult: '/api/v1/result',
    authUser: '/api/v1/auth'

  };

  constructor(private http: HttpClient, private jwt: JwtService) { }

    public authenticateUser(username: string, password: string): Observable<string> {
    const body = { username, password };
    return this.http.post<{ value: string }>(this.url.authUser, body).pipe(
      tap((response: { value: string }) => this.jwt.setToken(response.value)),
      map((response: { value: string }) => {
        return response.value;
      }));
  }


  public postResult(firstName: string, lastName: string, email: string, result: string, githubUrl: string): Observable<{message: string}> {
   
    const body = {firstName, lastName, email, result, githubUrl};
    const headers = { 'Authorization': `Bearer ${this.jwt.getToken()}`};
    return this.http.post<{ message: string }>(this.url.postResult, body, {headers}).pipe(
        tap((response: {message : string}) => console.log(response)),
        map((response: { message: string }) => {  
          return response}));
  }


}
