import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

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
  
  subscription: string
}

const stripePromise = loadStripe(
  "pk_test_51R4J42FC5bkJD5ptsh8bU6weX4xSsF5tjxfu6MWEq94xMRkgYaR8fQElp6frJV7S9rayfnvQiLj5ciRNTQ3HkTY900xsSe1vCC"
);

export const StripeSub = ({ user, subscription }: StripeSubProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchClientSecret = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/stripe/create-checkout-session-embedded",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user,subscription }),
                    }
                );
              const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Error fetching client secret:", error);
            }
        };

        fetchClientSecret();
    }, [user]);

    if (!clientSecret) {
        return <p>Laddar betalningssession...</p>;
    }

    return (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    );
};