import { useEffect, useState } from "react";
import { Users } from "../models/Users";
import { Link } from "react-router";

interface IConfirmSubscriptionChangePopupProps {
  user: Users;
  subscriptionId: string;
  trigger: boolean;
  changeTriggerValue: (value: boolean) => void;
  newSubscription: Users["subscription_id"];
}

export const ConfirmSubscriptionChangePopup = (
  props: IConfirmSubscriptionChangePopupProps
) => {
  const [isChangeSuccessful, setIsChangeSuccessful] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(false);
    setIsChangeSuccessful(false);
  }, []);

  const handleClose = () => {
    props.changeTriggerValue(false);
  };

  const handleConfirm = () => {
    const changeSubscription = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          "http://localhost:3000/stripe/update-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionId: props.subscriptionId,
              currentStripeSubscriptionId: props.user.stripe_subscription_id,
              email: props.user.email,
            }),
          }
        );
        await response.json();

        if (response) {
          setIsLoading(false);
          setIsChangeSuccessful(true);
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    changeSubscription();
  };
  return (
    <>
      {isLoading ? (
        <div className="popup">
          <div className="popup_inner">
            <div>
              <div>Loading.....</div>
            </div>
          </div>
        </div>
      ) : props.trigger && !isChangeSuccessful ? (
        <div className="popup">
          <div className="popup_inner">
            <button onClick={handleClose} className="close_btn">
              Close
            </button>
            <div>
              <div>
                <p>
                  You are about to change your subscription to{" "}
                  <b>{props.newSubscription?.level_name}</b>. You will be billed
                  immediatly. Do you wish to proceed?
                </p>{" "}
                <button onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      ) : props.trigger && isChangeSuccessful ? (
        <div className="popup">
          <div className="popup_inner">
            <div>
              <div>
                Successfully changed subscription to{" "}
                <b>{props.newSubscription?.level_name}!</b>
              </div>
              <Link to={"/my-page"}>
                <button>Back to my page</button>
              </Link>{" "}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
