import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../interfaces/product.interface';
import { ProductsService } from '../services/products.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, iif, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('scroller', { static: false }) scroller!: CdkVirtualScrollViewport;

  products: Product[] = [];
  total = 0;
  isLoading = true;
  ascSorting = new BehaviorSubject<boolean>(true);
  pageSize = new BehaviorSubject<number>(10);
  pageIndex = new BehaviorSubject<number>(0);
  isHandset = false;
  productCardHeight = 292;

  searchControl = new FormControl();
  suggestedProducts: Observable<
    Product[]
  > = this.searchControl.valueChanges.pipe(
    debounceTime(200),
    switchMap((value) => {
      return value.length > 3
        ? this.productsService.getSearchSuggestion(value)
        : of([]);
    })
  );

  searchHistory: Set<string> = new Set();
  isSearchHistoryInUse = false;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe(({ matches }) => {
        this.isHandset = matches;
        this.pageIndex.next(0);
        this.pageSize.next(10);
        this.clearListForMobile();
      });
  }

  ngOnInit(): void {
    combineLatest([
      this.route.queryParams,
      this.ascSorting,
      this.pageSize.pipe(distinctUntilChanged()),
      this.pageIndex.pipe(distinctUntilChanged()),
    ])
      .pipe(
        debounceTime(300),
        tap(() => (this.isLoading = true)),
        switchMap(([params, ascSorting, pageSize, pageIndex]) =>
          this.productsService.getProductList(
            pageIndex * pageSize,
            (pageIndex + 1) * pageSize,
            Number(params.category) || 0,
            params.search || '',
            ascSorting
          )
        )
      )
      .subscribe(({ items, total }) => {
        this.products =
          this.isHandset && this.pageIndex.value !== 0
            ? this.products.concat(items)
            : items;
        this.total = total;
        this.isLoading = false;
      });

    this.route.queryParamMap.subscribe(paramMap => {
      const searchTerm = paramMap.get('search') || '';
      this.searchControl.setValue(searchTerm);
      if (searchTerm) {
        this.searchHistory.add(searchTerm);
      }
    });

    this.searchControl.valueChanges.subscribe(
      (value) => (this.isSearchHistoryInUse = value.length === 0)
    );
  }

  ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < this.productCardHeight * 2),
        throttleTime(200)
      )
      .subscribe(() => {
        if (this.products.length < this.total) {
          this.ngZone.run(() => {
            this.pageIndex.next(
              Math.floor(this.products.length / this.pageSize.value)
            );
          });
        }
      });
  }

  toggleSorting(): void {
    this.clearListForMobile();
    this.ascSorting.next(!this.ascSorting.value);
    this.pageIndex.next(0);
  }

  pageChange({ pageSize, pageIndex }: PageEvent): void {
    this.pageSize.next(pageSize);
    this.pageIndex.next(pageIndex);
  }

  suggestionSelected({ option: { value } }: MatAutocompleteSelectedEvent) {
    if (value.id) {
      this.router.navigate(['/products', value.id]);
    } else {
      this.search();
    }
  }

  search(): void {
    this.searchHistory.add(this.searchControl.value);
    this.clearListForMobile();
    this.router.navigate([], {
      queryParams: { search: this.searchControl.value },
      queryParamsHandling: 'merge',
    });
  }

  getSearchHistory(): string[] {
    return [...this.searchHistory.values()];
  }

  clearSearchHistory(): void {
    this.searchHistory.clear();
  }

  private clearListForMobile(): void {
    if (this.isHandset && this.scroller) {
      this.products = [];
      this.scroller.scrollTo({ top: 0 });
    }
  }
}
