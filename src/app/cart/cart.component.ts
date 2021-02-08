import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductInCart } from '../interfaces/product.interface';
import { CartService } from '../services/cart.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.sass'],
})
export class CartComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<ProductInCart> = new MatTableDataSource(
    undefined
  );
  displayedColumns = ['name', 'price', 'amount', 'cost', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<CartComponent>,
    private cartService: CartService,
    private ordersService: OrdersService,
    private snackBar: MatSnackBar
  ) {
    dialogRef.afterOpened().subscribe(() => {
      this.refreshCart();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  clear(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.ordersService.addOrder(this.dataSource.data);
    this.snackBar.open('Checkout successful!', '', {
      duration: 3000,
      horizontalPosition: 'left'
    });
    this.clear();
  }

  delete(id: number): void {
    this.cartService.deleteFromCart(id);
    this.refreshCart();
  }

  refreshCart(): void {
    this.dataSource = new MatTableDataSource([
      ...this.cartService.cart.values(),
    ]);
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  updateCart(product: ProductInCart): void {
    if (product.amount < 1) {
      product.amount = 1;
    }
    product.cost = product.amount * product.price;
    this.cartService.setCart(this.dataSource.data);
  }

  getTotalCost(): number {
    return this.dataSource.data.reduce(
      (acc, { price, amount }) => acc + price * amount,
      0
    );
  }
}
