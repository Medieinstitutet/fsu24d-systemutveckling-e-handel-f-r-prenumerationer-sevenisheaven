import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";
import { Users } from "../models/Users";
import { API_URL } from "../services/baseService";

interface IUnsubscribePopupProps {
  trigger: boolean;
  changeIsSubscribed: (value: boolean) => void;
  changeTriggerValue: (value: boolean) => void;
}

export const UnsubscribePopup = (props: IUnsubscribePopupProps) => {
  const { user } = useAuth();
  const { fetchUserByEmailHandler } = useUser();

  const [userToUpdate, setUserToUpdate] = useState<Users | null>(null);

  const handleClose = () => {
    props.changeTriggerValue(false);
  };

  const confirmUnsubscribe = async () => {
    if (!userToUpdate) return;
    try {
      const response = await fetch(
        `${API_URL}/stripe/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: userToUpdate.stripe_subscription_id,
            email: userToUpdate.email,
          }),
        }
      );
      const data = await response.json()
      console.log(data);
      props.changeIsSubscribed(false);
      props.changeTriggerValue(false);
    } catch (err) {
      console.error("Unsubscribe failed:", err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user?.email);
        setUserToUpdate(result);
      }
    };
    getUser();
  }, [props.trigger]);
  return (
    <>
      {props.trigger ? (
        <div className="popup">
          <div className="popup_inner">
            <button onClick={handleClose} className="close_btn">
              Close
            </button>
            <div>
              <div>
                <h2>We're sorry to see you go!</h2>
                <h3>Are you sure you wish to unsubscribe?</h3>
                <button onClick={confirmUnsubscribe}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
