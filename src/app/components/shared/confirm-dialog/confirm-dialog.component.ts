import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Recibe los datos, en este caso el texto del mensaje
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo y pasa `true` cuando el usuario confirma
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo y pasa `false` cuando el usuario cancela
  }
}
