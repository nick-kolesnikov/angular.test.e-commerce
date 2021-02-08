import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { getProductById, getProductsByCategoryId, getProductsBySearchTerm } from 'src/mocks/helpers';
import { delay } from 'rxjs/operators';
import { ListWithTotal } from '../interfaces/list-with-total.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}

  getProductList(
    from: number,
    to: number,
    categoryId: number,
    searchTerm: string,
    ascSorting?: boolean,
  ): Observable<ListWithTotal<Product>> {
    return of(getProductsByCategoryId(from, to, categoryId, searchTerm, ascSorting)).pipe(
      delay(300)
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return of(getProductById(id)).pipe(delay(200));
  }

  getSearchSuggestion(searchTerm: string): Observable<Product[]> {
    return of(getProductsBySearchTerm(searchTerm)).pipe(delay(300));
  }
}
