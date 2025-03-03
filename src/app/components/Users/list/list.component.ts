import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    RouterModule,

  ],
})
export class ListComponent implements OnInit {
  users: UserData[] = [];
  totalUsers = 0;
  pageSize = 6;  // Cantidad de usuarios por carga
  pageIndex = 0; // Página actual
  private _snackBar = inject(MatSnackBar);

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.getAllUsers();
    this._userService.users$.subscribe(users => {
      this.users = users;
    });
  }

  getAllUsers(): void {
    this._userService.getUsers(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response: any) => {
        this.users = [...this.users, ...response.data];
        this.totalUsers = response.total;
      },
      error: (error) => {
        console.error('Error getting users:', error);
        this.openSnackBar('Error al obtener el listado de usuarios :(', 'Close')
      },
    });
  }

  loadMoreUsers() {
    this.pageIndex++;
    this.getAllUsers();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }
}
