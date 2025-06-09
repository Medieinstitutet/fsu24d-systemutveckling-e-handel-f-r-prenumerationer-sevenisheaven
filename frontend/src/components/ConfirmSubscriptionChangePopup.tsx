import { Users } from "../models/Users";

interface IConfirmSubscriptionChangePopupProps {
  user: Users;
  subscriptionId: string;
  trigger: boolean;
  changeTriggerValue: (value: boolean) => void;
}

export const ConfirmSubscriptionChangePopup = (
  props: IConfirmSubscriptionChangePopupProps
) => {
  const handleClose = () => {
    props.changeTriggerValue(false);
  };

  const handleConfirm = () => {
    const changeSubscription = async () => {
      try {
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
        const data = await response.json();
        if (response) {
          handleClose();
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    changeSubscription();
  };
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
                You are about to change your subscription to "new subscription
                name". You will be billed immediatly Do you wish to proceed? 
                <button onClick={handleConfirm}>Confirm</button>
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
