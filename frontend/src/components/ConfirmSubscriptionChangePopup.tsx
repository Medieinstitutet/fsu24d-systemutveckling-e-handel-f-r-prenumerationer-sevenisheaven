import { useEffect, useState } from "react";
import { Users } from "../models/Users";
import { Link } from "react-router";
import { API_URL } from "../services/baseService";

interface IConfirmSubscriptionChangePopupProps {
  user: Users;
  subscriptionId: string;
  trigger: boolean;
  changeTriggerValue: (value: boolean) => void;
  newSubscription: Users["subscription_id"];
}

export const ConfirmSubscriptionChangePopup = ({
  user,
  subscriptionId,
  trigger,
  changeTriggerValue,
  newSubscription,
}: IConfirmSubscriptionChangePopupProps) => {
  const [isChangeSuccessful, setIsChangeSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  useEffect(() => {
    if (trigger) {
      setIsLoading(false);
      setIsChangeSuccessful(false);
      setHasError(null);
    }
  }, [trigger]);

  const handleClose = () => {
    changeTriggerValue(false);
  };

 const handleConfirm = async () => {
  setIsLoading(true);
  setHasError(null);
   
  if (!user.stripe_subscription_id) {
    setHasError("Missing Stripe subscription ID for user.");
    setIsLoading(false);
    return;
  }

  try {
 const response = await fetch(
          `${API_URL}/stripe/update-subscription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionId: subscriptionId,
              currentStripeSubscriptionId: user.stripe_subscription_id,
              email: user.email,
            }),
          }
        );
   const data = await response.json();
   
    console.log(data);

    if (response.ok) {
      setIsChangeSuccessful(true);
    } else {
      setHasError(data?.message || "Something went wrong.");
    }
  } catch (error: any) {
    console.error("Subscription update error:", error);
    setHasError("Network error or server unavailable.");
  } finally {
    setIsLoading(false);
  }
 };
  
  if (!trigger) return null;

  return (
    <div className="overlay" aria-modal="true" role="dialog">
      <div className="modal">
        <button onClick={handleClose} className="close_btn">
          ✕
        </button>

        {isLoading ? (
          <div>Loading...</div>
        ) : isChangeSuccessful ? (
          <>
            <h3>Subscription Updated</h3>
            <p>
              You’ve successfully changed your subscription to <b>{newSubscription?.level_name}</b>!
            </p>
            <Link to="/my-page">
              <button>Back to My Page</button>
            </Link>
          </>
        ) : (
          <>
            <h3>Confirm Subscription Change</h3>
            <p>
              You are about to change your subscription to <b>{newSubscription?.level_name}</b>.{" "}
              You will be billed immediately. Do you wish to proceed?
            </p>

            {hasError && <p className="error">{hasError}</p>}

            <div className="popup_buttons">
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};