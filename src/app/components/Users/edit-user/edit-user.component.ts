import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserData } from '../../../models/user-model';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selectedAvatar: string = '';
  defaultAvatar: string = 'assets/images/avatar-default.png'
  private _snackBar = inject(MatSnackBar);
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
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getUserById(id: number): void {
    this._userService.getUserById(id).subscribe({
      next: (response: any) => {
        this.user = response.data;
        if (!this.user.avatar) {
          this.user.avatar = this.defaultAvatar;
        } else {
          this.selectedAvatar = this.user.avatar
        }
      },
      error: (error) => {
        console.error('Error getting user by ID:', error);
        this.openSnackBar('Error al obtener el usuario por ID :(', 'Close');
      },
      complete: () => {
        if (this.user) {
          this.userForm.setValue({
            first_name: this.user.first_name || '',
            last_name: this.user.last_name || '',
            email: this.user.email || ''
          });
        }
      }
    });
  }

 updateUser() {
  if (this.userForm.valid) {
    // Crear un objeto UserData con los valores del formulario
    const updatedUser: UserData = {
      id: this.userId, // Incluir el id del usuario
      first_name: this.userForm.get('first_name')?.value,
      last_name: this.userForm.get('last_name')?.value,
      email: this.userForm.get('email')?.value,
      avatar: this.selectedAvatar || this.user.avatar,
    };
    this._userService.updateUser(this.userId, updatedUser).subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.openSnackBar('Usuario actualizado con éxito!', 'Cerrar');
        this.router.navigate(['/user-data', this.user.id]);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.openSnackBar('Error al actualizar usuario', 'Cerrar');
      },
    });
  } else {
    console.log('Formulario inválido');
  }
  }


  // Simula la subida de imagen
  onAvatarChange(event: any): void {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedAvatar = 'https://prueba.com/imagen-cargada.jpg';
        this.user.avatar = reader.result as string;
        const avatarElement = document.querySelector('#avatar-img') as HTMLImageElement;
        if (avatarElement) {
          avatarElement.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._dialogService.openSimpleDialog('El archivo seleccionado debe ser una imagen');
      event.target.value = '';
    }
  }

  goBack() {
    this.location.back();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
