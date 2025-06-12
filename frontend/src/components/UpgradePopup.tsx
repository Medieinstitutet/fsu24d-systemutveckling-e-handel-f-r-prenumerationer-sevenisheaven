import { Link } from "react-router-dom";
import { Product } from "../models/Products";

export const UpgradePopup = ({
  trigger,
  product,
  onClose,
}: {
  trigger: boolean;
  product: Product;
  onClose: () => void;
}) => {
  if (!trigger || !product) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <button onClick={onClose} className="close_btn">
          ✕
        </button>
        <h2>Upgrade Needed</h2>
        <p>
          The product <strong>{product.product_name}</strong> requires{" "}
          <strong>{product.subscription_id.level_name}</strong> tier access.
        </p>
        <Link to={"/change_subscription"}>
          <button>Upgrade Now</button>
        </Link>
      </div>
    </div>
  );
};
