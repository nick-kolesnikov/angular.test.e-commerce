import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product.interface';
import { CartService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.sass'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  breadcrumbs: { id: number; name: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) return;
    this.productsService
      .getProductById(+productId)
      .pipe(
        tap(() => (this.isLoading = true)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((product) => {
        this.product = product;

        if (!product) {
          this.router.navigate(['/page-not-found']);
          return;
        }

        this.breadcrumbs = this.categoriesService.getBreadCrumbsForCategory(
          product.categoryId
        );
      });
  }

  buy() {
    this.cartService.addToCart(this.product!);
  }
}
