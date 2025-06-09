import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

interface StripeSubProps {
  user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    country: string;
    city: string;
    street_address: string;
    postal_code: string;
  };
  subscription: string;
}

const stripePromise = loadStripe("pk_test_51R4J42FC5bkJD5ptsh8bU6weX4xSsF5tjxfu6MWEq94xMRkgYaR8fQElp6frJV7S9rayfnvQiLj5ciRNTQ3HkTY900xsSe1vCC");

// Wrapper to separate Elements provider from form
export const StripeSub = ({ user, subscription }: StripeSubProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      const response = await fetch("http://localhost:3000/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, subscription }),
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    fetchClientSecret();
  }, [user, subscription]);

  if (!clientSecret) {
    return <p>Laddar betalningssession...</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm user={user} />
    </Elements>
  );
};

const CheckoutForm = ({ user }: { user: StripeSubProps["user"] }) => {
  const { createUserHandler } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/order-confirmation",
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Betalningen misslyckades");
      } else if (result.paymentIntent?.status === "succeeded") {
        await createUserHandler(user);
      }
    } catch (err: any) {
      console.error(err);
      setError("Ett oväntat fel uppstod.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Bearbetar..." : "Betala"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default StripeSub;