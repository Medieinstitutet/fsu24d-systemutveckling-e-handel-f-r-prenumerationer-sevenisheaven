export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export interface IProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface IProductUpdate {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}
