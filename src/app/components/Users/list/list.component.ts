import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,

  ],
})
export class ListComponent implements OnInit {
  users: UserData[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this._userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
      },
      error: (error) => {
        console.error('Error getting users:', error);
        this.openSnackBar('Error getting users :(', 'Close')
      },
      complete: () => {
        console.log(this.users);
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
