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
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
})
export class EditUserComponent implements OnInit {
  userId: number = 0;
  defaultAvatar: string = 'assets/images/avatar-default.png';
  userForm: FormGroup = new FormGroup({});
  user: UserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: this.defaultAvatar,
  };

  constructor(
    private _userService: UserService,
    private location: Location,
    private ActRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.ActRoute.params.subscribe((params) => {
      this.userId = +params['id'];
      this.getUserById(this.userId);
    });

    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getUserById(id: number): void {
    this._userService.getUserById(id).subscribe({
      next: (response: any) => {
        this.user = response.data;
        if (!this.user.avatar) {
          this.user.avatar = this.defaultAvatar;
        }
      },
      error: (error) => {
        console.error('Error getting user by ID:', error);
        this._dialogService.showSnackBar(
          'Error al obtener el usuario por ID :(',
          'error'
        );
      },
      complete: () => {
        if (this.user) {
          this.userForm.setValue({
            first_name: this.user.first_name || '',
            last_name: this.user.last_name || '',
            email: this.user.email || '',
          });
        }
      },
    });
  }

  updateUser() {
    if (this.userForm.valid) {
      const updatedUser: UserData = {
        id: this.userId,
        first_name: this.userForm.get('first_name')?.value,
        last_name: this.userForm.get('last_name')?.value,
        email: this.userForm.get('email')?.value,
        avatar: this.user.avatar || this.defaultAvatar,
      };
      this._userService.updateUser(this.userId, updatedUser).subscribe({
        next: (response) => {
          console.log('Usuario actualizado:', response);
          this._dialogService.showSnackBar(
            'Usuario actualizado con éxito!',
            'success'
          );
          this.router.navigate(['/user-data', this.user.id]);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this._dialogService.showSnackBar(
            'Error al actualizar usuario',
            'error'
          );
        },
      });
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        this.user.avatar = imageUrl;

        const avatarElement = document.querySelector(
          '#avatar-img'
        ) as HTMLImageElement | null;

        if (avatarElement) {
          avatarElement.src = imageUrl;
        } else {
          console.error('Avatar element not found!');
        }
      } else {
        this._dialogService.openSimpleDialog(
          'El archivo seleccionado debe ser una imagen'
        );
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
