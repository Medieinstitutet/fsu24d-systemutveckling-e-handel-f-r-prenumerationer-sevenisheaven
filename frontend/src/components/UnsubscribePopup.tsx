import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";
import { Users } from "../models/Users";

interface IUnsubscribePopupProps {
  trigger: boolean;
  changeIsSubscribed: (value: boolean) => void;
  changeTriggerValue: (value: boolean) => void;
}

export const UnsubscribePopup = ({
  trigger,
  changeIsSubscribed,
  changeTriggerValue,
}: IUnsubscribePopupProps) => {
  const { user } = useAuth();
  const { fetchUserByEmailHandler } = useUser();

  const [userToUpdate, setUserToUpdate] = useState<Users | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    changeTriggerValue(false);
  };

  const confirmUnsubscribe = async () => {
    if (!userToUpdate) return;
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: userToUpdate.stripe_subscription_id,
          email: userToUpdate.email,
        }),
      });

      const data = await response.json();
      console.log(data);
      changeIsSubscribed(false);
      changeTriggerValue(false);
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (user && trigger) {
        const result = await fetchUserByEmailHandler(user.email);
        setUserToUpdate(result);
      }
    };
    getUser();
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div className="overlay" aria-modal="true" role="dialog">
      <div className="modal">
        <button onClick={handleClose} className="close_btn">
          ✕
        </button>
        <h2>We're sorry to see you go!</h2>
        <p>Are you sure you want to unsubscribe from your plan?</p>
        <div className="unsubscribe_popup_buttons">
          <button onClick={confirmUnsubscribe} disabled={loading}>
            {loading ? "Unsubscribing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};