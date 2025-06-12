import { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Product } from "../models/Products";
import { useCart } from "../hooks/useCart";
import { ChangeSockPopup } from "./ChangeSockPopup";
import { UpgradePopup } from "./UpgradePopup";
import { Users } from "../models/Users";

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
  const [isPaymentFailed, setIsPaymentFailed] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);

  const [blockedSock, setBlockedSock] = useState<Product | null>(null);
  const [showUpgradePopup, setShowUpgradePopup] = useState<boolean>(false);

  const filterBySubscription = async (
    subscriptionTier: number,
    name: string
  ) => {
    setSubscriptionName(name);
    await fetchAllProductsHandler(String(subscriptionTier), 1, 12);
  };

  const handleProductClick = (product: Product) => {
    if (
      userSubscriptionTier === null ||
      product.subscription_id.tier > userSubscriptionTier
    ) {
      setBlockedSock(product);
      setShowUpgradePopup(true);
    }
  };

  const handleAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (cart?.product?._id) {
      setNewSock(product);
      setPopupTrigger(true);
    } else {
      addToCartHandler(product);
      alert("Added to your weekly sock");
    }
  };

  const changeTriggerValue = (value: boolean) => {
    setPopupTrigger(value);
  };

  useEffect(() => {
    const getUserSubscription = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user?.email);
        setCurrentUser(result);
        if (result && result.subscription_id) {
          setUserSubscriptionTier(result.subscription_id.tier);
        }
      }
    };
    getUserSubscription();
  }, []);

  useEffect(() => {
    setIsSubscribed(!!userSubscriptionTier);
    setIsPaymentFailed(currentUser?.subscription_status === "payment_failed");
  }, [userSubscriptionTier]);


  if (isPaymentFailed) {
    return (
      <>
        <div>
          You have a missed payment. Access limited.{" "}
          <a
            href={`${currentUser?.retry_payment_url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Press here to pay</button>
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      {!isSubscribed ? (
        <h3>
          You are currently not subscribed to any of our packages. Please
          subscribe for full access.
        </h3>
      ) : (
        <div className="sort_by_subscription">
          <div className="subscription_buttons">
            <button onClick={() => filterBySubscription(0, "")}>
              All socks
            </button>
            <button
              onClick={() =>
                filterBySubscription(
                  subscriptions[0].tier,
                  subscriptions[0].level_name
                )
              }
            >
              Sock Emergency <Star fill="#CD7F32" />
            </button>
            <button
              onClick={() =>
                filterBySubscription(
                  subscriptions[1].tier,
                  subscriptions[1].level_name
                )
              }
            >
              Sock & Roll <Star fill="#C0C0C0" />
            </button>
            <button
              onClick={() =>
                filterBySubscription(
                  subscriptions[2].tier,
                  subscriptions[2].level_name
                )
              }
            >
              Sock Royalty <Star fill="#FFD700" />
            </button>
          </div>
        </div>
      )}

      <h2>
        {subscriptionName !== ""
          ? `The ${subscriptionName} subscription has access to:`
          : "All socks:"}
      </h2>

      <div className="products_list">
        {products.map((p) => (
          <div
            key={p._id}
            className={`product_card ${
              p.subscription_id.tier > (userSubscriptionTier ?? 0)
                ? "no_access"
                : ""
            }`}
            onClick={() => handleProductClick(p)}
          >
            <img className="product_image" src={p.image} alt={p.product_name} />
            <div className="product_info">
              <p>{p.product_name}</p>
              <p>
                {p.subscription_id.level_name === "Sock Emergency" ? (
                  <Star fill="#CD7F32" />
                ) : p.subscription_id.level_name === "Sock & Roll" ? (
                  <Star fill="#C0C0C0" />
                ) : p.subscription_id.level_name === "Sock Royalty" ? (
                  <Star fill="#FFD700" />
                ) : null}
              </p>
            </div>
            {p.subscription_id.tier <= (userSubscriptionTier ?? 0) && (
              <button onClick={(e) => handleAddClick(e, p)}>
                Add to weekly sock
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Popups */}
      {newSock && (
        <ChangeSockPopup
          newSock={newSock}
          trigger={popupTrigger}
          changeTriggerValue={changeTriggerValue}
        />
      )}

      {blockedSock && (
        <UpgradePopup
          trigger={showUpgradePopup}
          product={blockedSock}
          onClose={() => setShowUpgradePopup(false)}
        />
      )}
    </>
  );
};
