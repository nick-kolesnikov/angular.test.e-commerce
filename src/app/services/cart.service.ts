import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../constants';
import { Product, ProductInCart } from '../interfaces/product.interface';
import { AuthService } from './auth.service';

const cartPrefix = `${Constants.lsPrefix}.cart`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: Map<number, ProductInCart> = new Map();
  cartBadge = new BehaviorSubject<number | string>(0);
  cartName = cartPrefix;

  constructor(private authService: AuthService) {
    authService.currentUser.subscribe((user) => {
      this.cartName = user ? `${cartPrefix}.${user.name}` : cartPrefix;
      this.loadCart();
    });
  }

  updateCartBadge(): void {
    const newSum = [...this.cart.values()].reduce(
      (acc, { amount }) => acc + amount,
      0
    );
    this.cartBadge.next(newSum < 100 ? newSum : ':D');
  }

  addToCart(product: Product): void {
    const { amount } = this.cart.get(product.id) || { amount: 0 };
    this.cart.set(product.id, {
      ...product,
      amount: amount + 1,
      cost: (amount + 1) * product.price,
    });
    this.saveCart();
  }

  deleteFromCart(id: number): void {
    this.cart.delete(id);
    this.saveCart();
  }

  clearCart(): void {
    this.cart = new Map();
    this.saveCart();
  }

  updateCart(products: ProductInCart[]): void {
    this.cart = new Map(
      products.map((product: ProductInCart) => [product.id, product])
    );
  }

  setCart(products: ProductInCart[]): void {
    this.updateCart(products);
    this.updateCartBadge();
    this.saveCart();
  }

  loadCart(): void {
    this.updateCart(JSON.parse(localStorage.getItem(this.cartName) || '[]'));
    this.updateCartBadge();
  }

  saveCart(): void {
    localStorage.setItem(
      this.cartName,
      JSON.stringify([...this.cart.values()])
    );
    this.updateCartBadge();
  }
}
