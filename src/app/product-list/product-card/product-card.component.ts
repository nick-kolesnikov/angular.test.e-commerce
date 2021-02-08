import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product.interface';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.sass'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  outOfStock = this.product?.quantity === 0;

  constructor(private router: Router, private cartService: CartService) {}

  navigateToProductDetails(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  buy(e: MouseEvent): void {
    e.stopPropagation();
    this.cartService.addToCart(this.product);
  }
}
