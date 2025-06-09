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

  const handleUnsubscribeClick = () => {
    setPopupTrigger(true);
  };

  const changeTriggerValue = (value: boolean) => {
    setPopupTrigger(value);
  };

  const changeIsSubscribed = (value: boolean) => {
    setIsSubscribed(value);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const result = await fetchUserByEmailHandler(user?.email);
        setCurrentUser(result);
      }
    };
    getUser();
  }, [isSubscribed]);

  useEffect(() => {
    setIsSubscribed(!!currentUser?.subscription_id);
  }, [currentUser]);

  return (
    <>
      <div>
        <div>
          Welcome {currentUser?.firstname} {currentUser?.lastname} to Totally
          Confused Socks!
        </div>
        {isSubscribed ? (
          <div>
            {" "}
            <Link to={"/change_subscription"}>
              <button>Change Subscription</button>
            </Link>{" "}
            <button onClick={handleUnsubscribeClick}>Unsubscribe</button>
            <UnsubscribePopup
              changeIsSubscribed={changeIsSubscribed}
              trigger={popupTrigger}
              changeTriggerValue={changeTriggerValue}
            ></UnsubscribePopup>
          </div>
        ) : (
          <div>
            <div>
              You are currently not subscribed to any packages. Limited access
              only.
            </div>
            <Link to={"/subscription"}>
              <button>Press here to subscribe again</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
