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
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule
      ],
})
export class EditUserComponent implements OnInit {

  user: UserData = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  };

  userId: number = 0;
  private _snackBar = inject(MatSnackBar);
  userForm: FormGroup = new FormGroup({});
  avatar: string = '';

  constructor(
    private _userService: UserService,
    private route: ActivatedRoute,
    private fb: FormBuilder, private http: HttpClient,
    private _confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.getUserById(this.userId);
    });

    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      avatar: ['', Validators.required],
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
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      // Usamos el servicio para crear un nuevo usuario
      this._userService.createUser(formData).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);
          this.openSnackBar('Usuario creado con éxito!', 'Cerrar'); // Mostrar un mensaje de éxito
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
          this.openSnackBar('Error al crear el usuario :(', 'Cerrar'); // Mostrar un mensaje de error
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        // Crear una URL temporal del archivo seleccionado
        const imageUrl = URL.createObjectURL(file);

        // Actualizar el formulario con la URL de la imagen
        this.userForm.patchValue({
          avatar: imageUrl,  // Establecer la URL en el formulario
        });

        // Actualizar el campo `avatar` del objeto `user`
        this.user.avatar = imageUrl;

        // Seleccionar el elemento de la imagen del avatar y actualizar su src
        const avatarElement = document.querySelector('#avatar-img') as HTMLImageElement | null;

        if (avatarElement) {
          avatarElement.src = imageUrl;  // Cambiar la imagen mostrada en el HTML
        } else {
          console.error('Avatar element not found!');
        }
      } else {
        alert('Por favor, seleccione una imagen');
      }
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 3000});
  }


}
