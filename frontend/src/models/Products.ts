export type Product = {
  _id: string;
  product_name: string;
  description: string;
  stock: number;
  subscription_id: {
    _id: string;
    level_name: string;
  };
  image: string;
};

export interface IProductCreate {
  product_name: string;
  description: string;
  stock: number;
  subscription_id: string;
  image: string;
}

export interface IProductUpdate {
  product_name: string;
  description: string;
  stock: number;
  subscription_id: string;
  image: string;
}
