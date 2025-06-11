import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Product } from "../models/Products";
import { useCart } from "../hooks/useCart";
import { ChangeSockPopup } from "./ChangeSockPopup";

export const RenderAllProducts = () => {
  const { user } = useAuth();

  const { products, fetchAllProductsHandler } = useProducts();
  const { fetchUserByEmailHandler } = useUser();
  const { cart, addToCartHandler } = useCart();
  const { subscriptions } = useSubscriptions();

  const [newSock, setNewSock] = useState<Product>();
  const [userSubscriptionTier, setUserSubscriptionTier] = useState<
    number | null
  >(null);
  const [popupTrigger, setPopupTrigger] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

  const [subscriptionName, setSubscriptionName] = useState<string>("");
  const filterBySubscription = async (
    subscriptionTier: number,
    subscriptionName: string
  ) => {
    setSubscriptionName(subscriptionName);
    await fetchAllProductsHandler(String(subscriptionTier), 1, 12);
  };

  const handleProductClick = (productTier: number) => {
    if (userSubscriptionTier === null || productTier > userSubscriptionTier) {
      alert("Redirect to subscribe page");
    }
  };

  const changeTriggerValue = (value: boolean) => {
    setPopupTrigger(value);
  };
  const handleAddClick = (product: Product) => {
    if (cart) {
      setNewSock(product);
      setPopupTrigger(true);
    } else {
      addToCartHandler(product);
      alert("Added to your weekly sock");
    }
  };

  useEffect(() => {
    const getUserSubscription = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user?.email);
        if (result && result.subscription_id) {
          setUserSubscriptionTier(result.subscription_id.tier);
        }
      }
    };
    getUserSubscription();
  }, []);

  useEffect(() => {
    setIsSubscribed(!!userSubscriptionTier);
  }, [userSubscriptionTier]);
  return (
    <>
      {!isSubscribed ? (
        <h3>
          You are currently not subscribed to any of our packages. Please
          subscribe for full access to our services.
        </h3>
      ) : (
        <div className="sort_by_subscription">
          <div className="subscription_buttons">
            <button
              onClick={() => {
                filterBySubscription(0, "");
              }}
            >
              All socks
            </button>
            <button
              onClick={() => {
                filterBySubscription(
                  subscriptions[0].tier,
                  subscriptions[0].level_name
                );
              }}
            >
              Sock Emergency <Star fill="#CD7F32"></Star>
            </button>
            <button
              onClick={() => {
                filterBySubscription(
                  subscriptions[1].tier,
                  subscriptions[1].level_name
                );
              }}
            >
              Sock & Roll <Star fill="#C0C0C0"></Star>
            </button>
            <button
              onClick={() => {
                filterBySubscription(
                  subscriptions[2].tier,
                  subscriptions[2].level_name
                );
              }}
            >
              Sock Royalty <Star fill="#FFD700 "></Star>
            </button>
          </div>
        </div>
      )}

      {subscriptionName !== "" ? (
        <h2>The {subscriptionName} subscription has access to:</h2>
      ) : (
        <h2>All socks:</h2>
      )}

      <div className="products_list">
        {products.map((p) => (
          <div
            className={`product_card ${
              p.subscription_id.tier > userSubscriptionTier! ? "no_access" : ""
            }`}
            onClick={() => {
              handleProductClick(p.subscription_id.tier);
            }}
            key={p._id}
          >
            <img className="product_image" src={p.image} alt="" />
            <div className="product_info">
              <p>{p.product_name}</p>
              <p>
                {p.subscription_id.level_name === "Sock Emergency" ? (
                  <Star fill="#CD7F32"></Star>
                ) : p.subscription_id.level_name === "Sock & Roll" ? (
                  <Star fill="#C0C0C0"></Star>
                ) : p.subscription_id.level_name === "Sock Royalty" ? (
                  <Star fill="#FFD700 "></Star>
                ) : (
                  ""
                )}
              </p>
            </div>
            {p.subscription_id.tier <= userSubscriptionTier! && (
              <button
                onClick={() => {
                  handleAddClick(p);
                }}
              >
                Add to weekly sock
              </button>
            )}
          </div>
        ))}
      </div>
      <ChangeSockPopup
        newSock={newSock!}
        trigger={popupTrigger}
        changeTriggerValue={changeTriggerValue}
      ></ChangeSockPopup>
    </>
  );
};
