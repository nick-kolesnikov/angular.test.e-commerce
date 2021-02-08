import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Order } from '../interfaces/order.interface';
import { AuthService } from '../services/auth.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass'],
})
export class OrdersComponent implements OnInit {
  isLoading = true;
  orders: Order[] = [];
  displayedColumns = ['name', 'price', 'amount', 'cost'];

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(switchMap(() => this.ordersService.getOrders()))
      .subscribe((orders) => {
        this.orders = orders;
        this.isLoading = false;
      });
  }
}
