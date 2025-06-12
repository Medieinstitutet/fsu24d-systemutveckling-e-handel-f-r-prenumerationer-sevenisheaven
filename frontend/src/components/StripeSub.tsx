import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { API_URL } from "../services/baseService";

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

const stripePromise = loadStripe(
  "pk_test_51R4J42FC5bkJD5ptsh8bU6weX4xSsF5tjxfu6MWEq94xMRkgYaR8fQElp6frJV7S9rayfnvQiLj5ciRNTQ3HkTY900xsSe1vCC"
);

export const StripeSub = ({ user, subscription }: StripeSubProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email || !subscription) return;

    const setupCheckout = async () => {
      try {
        const response = await fetch(
          `${API_URL}/stripe/create-checkout-session-embedded`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, subscription }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create Stripe session");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("StripeSub error:", err);
        setError("Ett fel uppstod vid uppstart av betalning");
      }
    };

    setupCheckout();
  }, [user, subscription]);

  if (error) return <p className="error">{error}</p>;
  if (!clientSecret) return <p>Laddar betalningssession...</p>;

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};