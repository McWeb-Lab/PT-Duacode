import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  imports: [
      CommonModule,
      RouterModule,
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
    private activateRoute: ActivatedRoute,
    private router: Router,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
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
        this.openSnackBar('Error al obtener el usuario por ID :(', 'Close');
      },
    });
  }

  deleteUser(id: number): void {
    const message = '¿Estás seguro de que deseas eliminar este usuario?';

    this._dialogService.openConfirmDialog(message).subscribe((result) => {
      if (result) {
        this._userService.deleteUser(id).subscribe({
          next: () => {
            this.openSnackBar('Usuario eliminado con éxito!', 'Close');
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.openSnackBar('Error al eliminar el usuario :(', 'Close');
          },
          complete: () => {
            this.router.navigate(['/list']);
          },
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }

}
