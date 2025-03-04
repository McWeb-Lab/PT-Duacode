import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { SimpleDialogComponent } from '../components/shared/simple-dialog/simple-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/shared/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openConfirmDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      width: '300px',
      data: { message },
    });

    return dialogRef.afterClosed();
  }

  openSimpleDialog(message: string): void {
    this.dialog.open(SimpleDialogComponent, {
      panelClass: 'simple-dialog',
      width: '300px',
      data: { message },
    });
  }

  showSnackBar(message: string, backgroundColor: string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: message,
      duration: 3000,
      panelClass: [backgroundColor],
    });
  }
}
