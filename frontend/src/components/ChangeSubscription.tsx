import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Users } from "../models/Users";
import { ConfirmSubscriptionChangePopup } from "./ConfirmSubscriptionChangePopup";

export const ChangeSubscription = () => {
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState<Users | null>(null);

  const { fetchUserByEmailHandler } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [popupTrigger, setPopupTrigger] = useState<boolean>(false);

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

  return (
    <div className="container">
      {error && <h3 className="error">{error}</h3>}

      {/* temporary */}
      <div className="subscriptions">
        <button
          onClick={() => {
            setSubscriptionId("68380950c659b1a48ce18927");
            handleNext();
          }}
        >
          1 - Sock Emergency
        </button>
        <button
          onClick={() => {
            setSubscriptionId("68380992c659b1a48ce18928");
            handleNext();
          }}
        >
          2 - Sock & Roll
        </button>
        <button
          onClick={() => {
            setSubscriptionId("683809b3c659b1a48ce18929");
            handleNext();
          }}
        >
          3 - Sock Royalty
        </button>
      </div>

      <ConfirmSubscriptionChangePopup
        user={currentUser!}
        trigger={popupTrigger}
        changeTriggerValue={changeTriggerValue}
        subscriptionId={subscriptionId}
      ></ConfirmSubscriptionChangePopup>
    </div>
  );
};
