import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { API_URL } from "../services/baseService";

export const OrderConfirmation = () => {
  const [sessionData, setSessionData] = useState({email:""});
  const { user, fetchUserByEmailHandler } = useUser();

  useEffect(() => {
    const fetchSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) return;

      try {
        const response = await fetch(
          `${API_URL}/stripe/sessions/${sessionId}`
        );
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (sessionData?.email) {
      fetchUserByEmailHandler(sessionData.email);
    }
  }, [sessionData]);

  let level = user?.subscription_id?.level_name

  const getStarColor = (level:string) => {
    switch (level) {
      case "Sock Emergency":
        return "#CD7F32";
      case "Sock & Roll":
        return "#C0C0C0";
      case "Sock Royalty":
        return "#FFD700";
      default:
        return "#cccccc";
    }
  };

  return (
    <>
      <h1>Subscription Confirmation</h1>
      {!sessionData || !user ? (
        <p>Loading...</p>
      ) : (
        <>
            <h2>Thank You, {user.firstname} {user.lastname}!</h2>
          <h3>
              You have subscription: <strong>{level}</strong> <Star fill={getStarColor(level)} />
          </h3>
        </>
      )}
      <p className="centered-p-element">
        You will receive a confirmation email with all the details about your
        new subscription. You can now log in with your email and password to
        order your first pair of TCS Socks.
        <br />
        At any time, you can cancel,
        downgrade or upgrade your subscription. To do so, simply log in to your
        account.
      </p>
    </>
  );
};