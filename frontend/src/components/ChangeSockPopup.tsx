import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Product } from "../models/Products";
import { useCart } from "../hooks/useCart";

interface IChangeSockPopupProps {
  trigger: boolean;
  changeTriggerValue: (value: boolean) => void;
  newSock: Product;
}

export const ChangeSockPopup = ({ trigger, changeTriggerValue, newSock }: IChangeSockPopupProps) => {
  const { cart } = useContext(CartContext);
  const { addToCartHandler } = useCart();

  if (!trigger || !cart) return null;

  const isSameSock = cart.product._id === newSock._id;

  const handleChangeConfirm = () => {
    addToCartHandler(newSock);
    changeTriggerValue(false);
    alert("Sock changed");
  };

  const handleClose = () => {
    changeTriggerValue(false);
  };

  return (
    <div className="overlay" aria-modal="true" role="dialog">
      <div className="modal">
        <button onClick={handleClose} className="close_btn">
          ✕
        </button>
        {isSameSock ? (
          <div>
            You already have <strong>{newSock.product_name}</strong> as your weekly sock!
            <div className="change_sock_popup_buttons">
            </div>
          </div>
        ) : (
          <div className="change_sock_popup">
            <h3>Do you wish to change your weekly sock?</h3>
            <p>
              You've currently chosen <strong>{cart.product.product_name}</strong> as your weekly sock.<br />
              Do you wish to change to <strong>{newSock.product_name}</strong>?
            </p>
            <div className="change_sock_popup_buttons">
              <button onClick={handleChangeConfirm}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};