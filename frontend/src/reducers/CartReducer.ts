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

export const CartReducer = (cartState: Cart | null, action: ICartAction): Cart | null => {
  switch (action.type) {
    case ICartActionType.ADDED: {
      const p: Product = JSON.parse(action.payload);
      return new Cart(p);
    }
    case ICartActionType.EMPTIED: {
      return null;
    }
  }
};
