import { useEffect, useState } from "react";
import { UnsubscribePopup } from "./UnsubscribePopup";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { Users } from "../models/Users";
import { Link } from "react-router";

export const RenderMyPage = () => {
  const { user } = useAuth();
  const { fetchUserByEmailHandler } = useUser();

  const [currentUser, setCurrentUser] = useState<Users | null>(null);
  const [popupTrigger, setPopupTrigger] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [isSubscriptionCancelling, setIsSubscriptionCancelling] =
    useState<boolean>(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState<boolean>(false);

  const handleUnsubscribeClick = () => setPopupTrigger(true);
  const changeTriggerValue = (value: boolean) => setPopupTrigger(value);
  const changeIsSubscribed = (value: boolean) => setIsSubscribed(value);
  const resumeSubscription = async () => {
    console.log(currentUser?.email);

    try {
      const response = await fetch(
        "http://localhost:3000/stripe/resume-subscription",
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
      console.error("Unsubscribe failed:", err);
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
  }, [user]);

  useEffect(() => {
    setIsSubscribed(!!currentUser?.subscription_id);
    setIsSubscriptionCancelling(
      currentUser?.subscription_status === "cancelling"
    );
    setIsPaymentFailed(currentUser?.subscription_status === "payment_failed");
  }, [currentUser]);

  console.log(isPaymentFailed);

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
        ) : isPaymentFailed ? (
          <div>
            <div>You have an unpaid subscription fee.</div>
            <p>Your subscription is temporarily disabled until you have paid the invoice.</p>
            
            
            <a
              href={`${currentUser?.retry_payment_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Press here to pay</button>
            </a>
            
          </div>
        ) : isSubscribed ? (
          <div>
            <Link to={"/change_subscription"}>
              <button>Change Subscription</button>
            </Link>
            <button onClick={handleUnsubscribeClick}>Unsubscribe</button>
            <UnsubscribePopup
              changeIsSubscribed={changeIsSubscribed}
              trigger={popupTrigger}
              changeTriggerValue={changeTriggerValue}
            />
          </div>
        ) : (
          <div>
            <div>
              You are currently not subscribed to any packages. Limited access
              only.
            </div>
            <button>Press here to subscribe again (does nothing yet)</button>
          </div>
        )}
      </div>
    </>
  );
};
