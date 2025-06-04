import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCart } from "../hooks/useCart";

export const Cart = () => {
  const { cart } = useContext(CartContext);

  const { emptyHandler } = useCart();
  console.log(cart);
  const handleClick = () => {
    emptyHandler();
  };

  return (
    <>
      <h2>Your weekly sock:</h2>

      {cart === null ? (
        <div>You have not chosen a weekly sock yet!</div>
      ) : (
        <div>
          {" "}
          <div>
            <p>{cart.product.product_name}</p>
            <img src={cart.product.image} alt="" />
          </div>
          <button onClick={handleClick}>Remove sock</button>
        </div>
      )}
    </>
  );
};
