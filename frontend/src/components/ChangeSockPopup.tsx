import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Product } from "../models/Products";

interface IChangeSockPopupProps {
  trigger: boolean;
  changeTriggerValue: (value: boolean) => void;
  newSock: Product;
}

export const ChangeSockPopup = (props: IChangeSockPopupProps) => {
  const { cart } = useContext(CartContext);

  const handleClose = () => {
    props.changeTriggerValue(false);
  };
  return (
    <>
      {props.trigger ? (
        <div className="popup">
          <div className="popup_inner">
            <button onClick={handleClose} className="close_btn">
              Close
            </button>
            <div>
              {cart.map((c, i) => (
                <div key={i}>
                  {c.product._id === props.newSock._id ? (
                    <div>
                      You already have <b>{props.newSock.product_name}</b> as
                      your weekly sock!
                    </div>
                  ) : (
                    <div className="change_sock_popup">
                      <div>
                        <h3>Do you wish to change your weekly sock?</h3>
                        You've currently chosen <b>
                          {c.product.product_name}
                        </b>{" "}
                        as your weekly sock. Do you wish to change to{" "}
                        <b>{props.newSock.product_name}</b>?
                      </div>
                      <div className="change_sock_popup_buttons">
                        <button>Confirm</button>
                        <button>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
