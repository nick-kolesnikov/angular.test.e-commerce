import { productList } from './products.json';
import { categories } from './categories.json';
import { Category } from 'src/app/interfaces/category.interface';
import { ListWithTotal } from 'src/app/interfaces/list-with-total.interface';
import { Product } from 'src/app/interfaces/product.interface';

export const categoriesMapByParent: Map<number, Category[]> = categories.reduce(
  (map, category) =>
    map.set(category.parent, [...(map.get(category.parent) || []), category]),
  new Map()
);

const getNestedCategoriesIds = (parentId: number): number[] =>
  (categoriesMapByParent.get(parentId) || []).reduce(
    (res, { id }) => [
      ...res,
      id,
      ...(categoriesMapByParent.has(id) ? getNestedCategoriesIds(id) : []),
    ],
    <number[]>[]
  );

export const getProductsByCategoryId = (
  from: number,
  to: number,
  categoryId: number,
  searchTerm: string,
  ascSorting: boolean = true
): ListWithTotal<Product> => {
  const categories = new Set([
    categoryId,
    ...getNestedCategoriesIds(categoryId),
  ]);
  const products = getProductsBySearchTerm(searchTerm)
    .filter(({ categoryId }) => categories.has(categoryId))
    .sort(({ price: priceA }, { price: priceB }) =>
      ascSorting ? priceA - priceB : priceB - priceA
    );
  return {
    items: products.slice(from, to),
    total: products.length,
  };
};

export const getProductById = (idToSearch: number): Product | null => {
  const product = productList.find(({ id }) => id === idToSearch);
  return product
    ? { ...product, image: product.image.replace('100x100', '350x350') }
    : null;
};

export const getProductsBySearchTerm = (searchTerm: string): Product[] =>
  productList.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
