import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from '../models/user-model';

// Servicio para el CRUD con la API

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // URL base de la API
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserData[]> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserData): Observable<UserData> {
    return this.http.post<UserData>(this.apiUrl, user);
  }

  updateUser(id: number, user: UserData): Observable<UserData> {
    return this.http.put<UserData>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
