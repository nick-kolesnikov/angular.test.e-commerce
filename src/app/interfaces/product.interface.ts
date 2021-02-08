export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  image: string;
  description: string;
  quantity: number;
}

export interface ProductInCart extends Product {
  amount: number;
  cost: number;
}