import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  imports: [
      CommonModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule
    ],
})
export class UserDataComponent implements OnInit {

  user: UserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  };

  userId: number = 0;

  private _snackBar = inject(MatSnackBar);

  constructor(
    private _userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.getUserById(this.userId);
    });
  }

  getUserById(id: number): void {
    this._userService.getUserById(id).subscribe({
      next: (response: any) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('Error getting user by ID:', error);
        this.openSnackBar('Error getting user by ID :(', 'Close');
      },
      complete: () => {
        console.log(this.user);
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
