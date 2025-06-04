import { Star } from "lucide-react";

export const OrderConfirmation = () => {
  const getStarColor = (level?: string) => {
    switch (level) {
      case "Sock Emergency":
        return "#CD7F32";
      case "Sock & Roll":
        return "#C0C0C0";
      case "Sock Royalty":
        return "#FFD700";
      default:
        return "#cccccc"; // fallback
    }
  };
  return (
    <>
      <h1>Order Confirmation</h1>
      <h3>Thank You! {/* ${user.name} */}</h3>
      <h3>
        You have subscription {/* ${user.level} */}{" "}
        <Star fill={getStarColor(/* levelName */)} />
      </h3>
      <p className="centered-p-element">
        You will receive a confirmation email with all the details about your
        new subscription. You can now log in with your email and password to
        order your first pair of TCS Socks. At any time, you can cancel,
        downgrade, or upgrade your subscription. To do so, simply log in to your
        account.
      </p>
    </>
  );
};
