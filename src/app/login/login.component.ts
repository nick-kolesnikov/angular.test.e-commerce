import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<LoginComponent>) { }

  login(): void {
    if (this.name) this.dialogRef.close(this.name);
  }
}
