import { createContext, Dispatch, PropsWithChildren, useReducer } from "react";
import { Cart } from "../models/Cart";
import { CartReducer, ICartAction } from "../reducers/CartReducer";

export interface ICartContext {
  cart: Cart[];
  cartDispatch: Dispatch<ICartAction>;
}

export const CartContext = createContext<ICartContext>({
  cart: [],
  cartDispatch: () => {
    return;
  },
});

export const CartProvider = ({children}: PropsWithChildren) => {
  const [cart, cartDispatch] = useReducer(CartReducer, [], () => {
    const cachedCart = localStorage.getItem("cart");
    return cachedCart ? JSON.parse(cachedCart) : [];
  });

  return (
    <CartContext.Provider value={{ cart, cartDispatch }}>
      {children} 
    </CartContext.Provider>
  )
}




 
