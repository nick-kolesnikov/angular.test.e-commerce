import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from './interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { CartComponent } from './cart/cart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'e-commerce-example';
  isHandset = false;
  currentUser: User | null = null;

  constructor(
    public cartService: CartService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe(({ matches }) => (this.isHandset = matches));
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      (currentUser) => (this.currentUser = currentUser)
    );
  }

  showLoginModal(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '350px',
    });

    dialogRef
      .afterClosed()
      .subscribe((name) => name && this.authService.login(name));
  }

  logout(): void {
    this.authService.logout();
  }

  openCart() {
    this.dialog.open(CartComponent, {
      width: '85vw',
      maxWidth: '700px',
      maxHeight: '80vh'
    });
  }
}
