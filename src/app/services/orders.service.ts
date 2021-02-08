import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Constants } from '../constants';
import { Order } from '../interfaces/order.interface';
import { ProductInCart } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

const orderListPrefix = `${Constants.lsPrefix}.orderList`;

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  lsKey = orderListPrefix;

  constructor(private authService: AuthService) {
    authService.currentUser.subscribe((user) => {
      this.lsKey = user ? `${orderListPrefix}.${user.name}` : orderListPrefix;
    });
  }

  addOrder(products: ProductInCart[]): void {
    const orderList = JSON.parse(localStorage.getItem(this.lsKey) || '[]');
    localStorage.setItem(
      this.lsKey,
      JSON.stringify([
        ...orderList,
        {
          date: new Date(),
          products,
          total: products.reduce((acc, { cost }) => acc + cost, 0),
        },
      ])
    );
  }

  getOrders(): Observable<Order[]> {
    return of(JSON.parse(localStorage.getItem(this.lsKey) || '[]')).pipe(
      delay(300)
    );
  }
}
