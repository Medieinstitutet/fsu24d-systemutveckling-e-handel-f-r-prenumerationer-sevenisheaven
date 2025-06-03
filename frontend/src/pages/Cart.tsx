import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCart } from "../hooks/useCart";

export const Cart = () => {
  const { cart } = useContext(CartContext);

  const { emptyHandler } = useCart();
  console.log(cart);
  const handleClick = () => {
    emptyHandler()
  };

  return (
    <>
      <h2>Your weekly sock:</h2>
      {cart.map((c, i) => (
        <div key={i}>
          <p>{c.product.product_name}</p>
          <img src={c.product.image} alt="" />
        </div>
      ))}
      <button onClick={handleClick}>Remove sock</button>
    </>
  );
};
