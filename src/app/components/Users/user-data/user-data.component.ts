import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
    MatMenuModule,
  ],
})
export class UserDataComponent implements OnInit {
  defaultAvatar: string = 'assets/images/avatar-default.png';
  user: UserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: this.defaultAvatar,
  };

  userId: number = 0;

  constructor(
    private _userService: UserService,
    private location: Location,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
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
        if (this.userId == 0) {
          this._dialogService.openSimpleDialog(
            'Aquí recuperaría el usuario correctamente, pero entiendo que al no crearlo realmente en la API, no encuentra el id :)'
          );
        } else {
          console.error('Error getting user by ID:', error);
          this._dialogService.showSnackBar(
            'Error al obtener el usuario por ID :(',
            'error'
          );
        }
      },
    });
  }

  deleteUser(id: number): void {
    const message = '¿Estás seguro de que deseas eliminar este usuario?';

    this._dialogService.openConfirmDialog(message).subscribe((result) => {
      if (result) {
        this._userService.deleteUser(id).subscribe({
          next: () => {
            this._dialogService.showSnackBar(
              'Usuario eliminado con éxito!',
              'success'
            );
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this._dialogService.showSnackBar(
              'Error al eliminar el usuario :(',
              'error'
            );
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

  goBack() {
    this.location.back();
  }
}
