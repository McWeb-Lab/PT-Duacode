import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../models/user-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(page: number, perPage: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&per_page=${perPage}`
    );
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
