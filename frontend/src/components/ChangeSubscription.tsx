import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Users } from "../models/Users";
import { ConfirmSubscriptionChangePopup } from "./ConfirmSubscriptionChangePopup";
import SockEmergency from "../assets/sock_emergency.png";
import SockRoll from "../assets/sock&roll.png";
import SockRoyalty from "../assets/sock_royalty.png";
import { fetchSubscriptionById } from "../services/subscriptionServices";

export const ChangeSubscription = () => {
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const { fetchUserByEmailHandler } = useUser();
  const [subscriptionId, setSubscriptionId] = useState("");
  const [newSubscription, setNewSubscription] = useState<Users["subscription_id"]>()
  const [popupTrigger, setPopupTrigger] = useState<boolean>(false);

  console.log(currentUser?.subscription_id?._id);

  const isSubscribedStyling = { cursor: "default", opacity: 0.5 }

  const handleNext = () => {
    setPopupTrigger(true);
  };

  const changeTriggerValue = (value: boolean) => {
    setPopupTrigger(value);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user?.email);
        setCurrentUser(result);
      }
    };
    getUser();
  }, []);

useEffect(() => {
  const getSubscription = async () => {
    const response = await fetchSubscriptionById(subscriptionId)
    setNewSubscription(response)
  }
  getSubscription()
}, [subscriptionId])

  return (
    <div className="container">
      <h3>Change subscription</h3>
      {/* temporary */}
      <section className="subscriptions">
        <button
          disabled={
            currentUser?.subscription_id?._id === "68380950c659b1a48ce18927"
          }
          onClick={() => {
            setSubscriptionId("68380950c659b1a48ce18927");
            handleNext();
          }}
        >
          <div className="subscription" style={currentUser?.subscription_id?._id === "68380950c659b1a48ce18927" ? isSubscribedStyling : undefined}>
            <div className="level-div">
              <h4>Sock Emergency</h4>
              <img style={{ height: "80px" }} src={SockEmergency} />
              <p>
                Start fresh with stylish essentials. Great quality, comfy fit,
                and timeless designs delivered monthly
              </p>
            </div>

            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>14.99 €</h1>
            </div>
          </div>
        </button>
        <button
          disabled={
            currentUser?.subscription_id?._id === "68380992c659b1a48ce18928"
          }
          onClick={() => {
            setSubscriptionId("68380992c659b1a48ce18928");
            handleNext();
          }}
        >
          <div className="subscription" style={currentUser?.subscription_id?._id === "68380992c659b1a48ce18928" ? isSubscribedStyling : undefined}>
            <div className="level-div">
              <h4>Sock & Roll</h4>
              <img style={{ height: "80px" }} src={SockRoll} />
              <p>
                Step it up with bolder patterns, richer materials, and
                limited-edition drops. Where comfort meets personality.
              </p>
            </div>
            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>16.99 €</h1>
            </div>
          </div>
        </button>
        <button
          disabled={
            currentUser?.subscription_id?._id === "683809b3c659b1a48ce18929"
          }
          onClick={() => {
            setSubscriptionId("683809b3c659b1a48ce18929");
            handleNext();
          }}
        >
          <div className="subscription" style={currentUser?.subscription_id?._id === "683809b3c659b1a48ce18929" ? isSubscribedStyling : undefined}>
            <div className="level-div">
              <h4>Sock Royalty</h4>
              <img style={{ height: "80px" }} src={SockRoyalty} />
              <p>
                Top-tier toes only. Exclusive designer styles, luxury fabrics,
                and maximum sock swag. The best of the best.
              </p>
            </div>{" "}
            <div className="price-div">
              <h1 style={{ fontSize: "2.5rem" }}>18.99 €</h1>
            </div>
          </div>
        </button>
      </section>

      <ConfirmSubscriptionChangePopup
        user={currentUser!}
        trigger={popupTrigger}
        changeTriggerValue={changeTriggerValue}
        subscriptionId={subscriptionId}
        newSubscription={newSubscription!}
      ></ConfirmSubscriptionChangePopup>
    </div>
  );
};

// {/* temporary */}
//       <div className="subscriptions">
//         <button
//           onClick={() => {
//             setSubscriptionId("68380950c659b1a48ce18927");
//             handleNext();
//           }}
//         >
//           1 - Sock Emergency
//         </button>
//         <button
//           onClick={() => {
//             setSubscriptionId("68380992c659b1a48ce18928");
//             handleNext();
//           }}
//         >
//           2 - Sock & Roll
//         </button>
//         <button
//           onClick={() => {
//             setSubscriptionId("683809b3c659b1a48ce18929");
//             handleNext();
//           }}
//         >
//           3 - Sock Royalty
//         </button>
//       </div>
