import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { categoriesMapByParent } from 'src/mocks/helpers';
import { CategoryNode } from '../interfaces/category-node.interface';
import { Category } from '../interfaces/category.interface';
import { categories } from 'src/mocks/categories.json';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor() {}

  getCategoriesTree(): Observable<CategoryNode[]> {
    const categoryToCategoryNode = ({ id, name }: Category): CategoryNode => ({
      id,
      name,
      children:
        categoriesMapByParent.get(id)?.map(categoryToCategoryNode) || [],
    });

    return of(
      categoriesMapByParent.get(0)?.map(categoryToCategoryNode) || []
    ).pipe(delay(200));
  }

  getBreadCrumbsForCategory(categoryId: number) {
    const categoriesMap = new Map<number, Category>(
      categories.map((category) => [category.id, category])
    );

    const res: { id: number; name: string }[] = [];

    const buildStep = (id: number) => {
      if (id !== 0 && categoriesMap.has(id)) {
        const { name, parent } = categoriesMap.get(id)!;
        res.push({ id, name });
        buildStep(parent);
      }
    };

    buildStep(categoryId);
    return res.reverse();
  }
}
