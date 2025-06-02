import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { Star, StarHalf } from "lucide-react";

export const RenderAllProducts = () => {
  const { products, fetchAllProductsHandler } = useProducts();
  const { subscriptions } = useSubscriptions();

  const [subscriptionName, setSubscriptionName] = useState<string>("");
  const filterBySubscription = async (
    subscriptionId: string,
    subscriptionName: string
  ) => {
    console.log(subscriptionName);

    setSubscriptionName(subscriptionName);
    await fetchAllProductsHandler(subscriptionId, 1, 12);
  };

  return (
    <>
      <div>
        <Star fill="#CD7F32"></Star>
      </div>
      <div>
        <Star fill="#C0C0C0"></Star>
      </div>
      <div>
        <Star fill="#FFD700 "></Star>
      </div>
      <div className="sort_by_subscription">
        <div className="subscription_buttons">
          <button
            onClick={() => {
              filterBySubscription("", "");
            }}
          >
            All socks
          </button>
          <button
            onClick={() => {
              filterBySubscription(
                subscriptions[0]._id,
                subscriptions[0].level_name
              );
            }}
          >
            Sock Emergency <Star fill="#CD7F32"></Star>
          </button>
          <button
            onClick={() => {
              filterBySubscription(
                subscriptions[1]._id,
                subscriptions[1].level_name
              );
            }}
          >
            Sock & Roll <Star fill="#C0C0C0"></Star>
          </button>
          <button
            onClick={() => {
              filterBySubscription(
                subscriptions[2]._id,
                subscriptions[2].level_name
              );
            }}
          >
            Sock Royalty <Star fill="#FFD700 "></Star>
          </button>
        </div>
      </div>

      {subscriptionName == "Sock Emergency" ? (
        <h2>
          Socks you can choose between in the {subscriptionName} subscription:
        </h2>
      ) : subscriptionName == "Sock & Roll" ? (
        <h2>
          Socks you can choose between in the {subscriptionName} subscription:
        </h2>
      ) : subscriptionName == "Sock Royalty" ? (
        <h2>
          Socks you can choose between in the {subscriptionName} subscription:
        </h2>
      ) : (
        <h2>All socks:</h2>
      )}

      <p>
        Note: När man sorterar på de olika prenumerationerna borde kanske alla
        strumpor som man kan välja mellan synas.
        <br />
        Eller på något annat sätt göra det tydligt att alla strumpor från den
        föregående leveln ingår i de högre levlarna
      </p>

      <div className="products_list">
        {products.map((p) => (
          <div className="product_card" key={p._id}>
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
          </div>
        ))}
      </div>
    </>
  );
};
