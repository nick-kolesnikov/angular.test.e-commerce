import { ProductInCart } from "./product.interface";

export interface Order {
  date: Date;
  products: ProductInCart[];
  total: number;
}