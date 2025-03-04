import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
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
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
})
export class NewUserComponent implements OnInit {
  defaultAvatar: string = 'assets/images/avatar-default.png';
  user: UserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: this.defaultAvatar,
  };

  userId: number = 0;
  userForm: FormGroup = new FormGroup({});
  avatar: string = '';

  constructor(
    private _userService: UserService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder,
    private _dialogService: DialogService
  ) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createUser() {
    if (this.userForm.valid) {
      const newUser: UserData = {
        id: this.userId,
        first_name: this.userForm.get('first_name')?.value,
        last_name: this.userForm.get('last_name')?.value,
        email: this.userForm.get('email')?.value,
        avatar: this.user.avatar || this.defaultAvatar,
      };
      this._userService.createUser(newUser).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);
          this._dialogService.showSnackBar(
            'Usuario creado con éxito!',
            'success'
          );
          this.router.navigate(['/user-data', this.user.id]);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this._dialogService.showSnackBar('Error al crear usuario', 'error');
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
