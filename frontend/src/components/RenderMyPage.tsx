import { useEffect, useState } from "react";
import { UnsubscribePopup } from "./UnsubscribePopup";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Users } from "../models/Users";
import { Link } from "react-router";
import { API_URL } from "../services/baseService";

export const RenderMyPage = () => {
  const { user } = useAuth();
  const { fetchUserByEmailHandler } = useUser();

  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const [popupTrigger, setPopupTrigger] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [isSubscriptionCancelling, setIsSubscriptionCancelling] =
    useState<boolean>(false);

  const handleUnsubscribeClick = () => {
    setPopupTrigger(true);
  };

  const changeTriggerValue = (value: boolean) => {
    setPopupTrigger(value);
  };

  const changeIsSubscribed = (value: boolean) => {
    setIsSubscribed(value);
  };

  const resumeSubscription = async () => {
    try {
      const response = await fetch(
        `${API_URL}/stripe/resume-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: currentUser?.stripe_subscription_id,
            email: currentUser?.email,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("Resume subscription failed:", err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user.email);
        setCurrentUser(result);
      }
    };
    getUser();
  }, [user, isSubscribed, fetchUserByEmailHandler]);

  useEffect(() => {
    setIsSubscribed(!!currentUser?.subscription_id);
    setIsSubscriptionCancelling(
      currentUser?.subscription_status === "cancelling"
    );
  }, [currentUser]);

  return (
    <>
      <div>
        <div>
          Welcome {currentUser?.firstname} {currentUser?.lastname} to Totally
          Confused Socks!
        </div>

        {isSubscriptionCancelling ? (
          <div>
            <div>
              Your subscription will be cancelled on{" "}
              {currentUser?.subscription_ends_at}
            </div>
            <button onClick={resumeSubscription}>Resume subscription</button>
          </div>
        ) : isSubscribed ? (
          <div>
            <Link to={"/change_subscription"}>
              <button>Change Subscription</button>
            </Link>
            <button onClick={handleUnsubscribeClick}>Unsubscribe</button>
          </div>
        ) : (
          <div>
            <div>
              You are currently not subscribed to any packages. Limited access
              only.
            </div>
            <button>
              Press here to subscribe again (does nothing yet)
            </button>
          </div>
        )}
      </div>

      {popupTrigger && (
        <UnsubscribePopup
          changeIsSubscribed={changeIsSubscribed}
          trigger={popupTrigger}
          changeTriggerValue={changeTriggerValue}
        />
      )}
    </>
  );
};