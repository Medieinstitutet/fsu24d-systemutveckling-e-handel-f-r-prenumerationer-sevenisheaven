import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { ICartActionType } from "../reducers/CartReducer";
import { Product } from "../models/Products";

export const useCart = () => {
  const { cart, cartDispatch } = useContext(CartContext);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCartHandler = (product: Product) => {
    cartDispatch({
      type: ICartActionType.ADDED,
      payload: JSON.stringify(product),
    });
  };

  const emptyHandler = () => {
    localStorage.removeItem("cart");
    cartDispatch({
      type: ICartActionType.EMPTIED,
      payload: "",
    });
  };

  return {
    cart,
    addToCartHandler,
    emptyHandler
  };
};
