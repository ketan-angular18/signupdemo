import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-mat-dialog',
  standalone: true,
  imports: [MatDialogModule,
           MatButtonModule],
  templateUrl: './mat-dialog.component.html',
  styleUrl: './mat-dialog.component.css'
})

export class MatDialogComponent {

  /**
   * @dialogRef for inject matdialogrefrence
   */
  public dialogRef = inject(MatDialogRef<MatDialogComponent>)

  /**
   * onNoClick for close dialog ref and pass click as result 
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * onNoClick for close dialog ref and pass click true as result 
   */
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
