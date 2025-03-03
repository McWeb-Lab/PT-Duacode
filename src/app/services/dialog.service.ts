import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { SimpleDialogComponent } from '../components/shared/simple-dialog/simple-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

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
}
