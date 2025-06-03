import { Cart } from "../models/Cart";
import { Product } from "../models/Products";

export interface ICartAction {
  payload: string;
  type: ICartActionType;
}

export enum ICartActionType {
  ADDED,
  EMPTIED,
}

export const CartReducer = (cartState: Cart[], action: ICartAction): Cart[] => {
  switch (action.type) {
    case ICartActionType.ADDED: {
      const p: Product = JSON.parse(action.payload);
      return [...cartState, new Cart(p)];
    }
    case ICartActionType.EMPTIED: {
      return [];
    }
  }
  return cartState;
};
