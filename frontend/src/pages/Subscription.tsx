import { FormEvent, useState } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { useUser } from "../hooks/useUser";
import { StripeSub } from "../components/StripeSub";
import { ChooseSubscription } from "../components/ChooseSubscription";

export const Subscription = () => {
  const { fetchUserByEmailHandler, createUserHandler } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3">("step-1");
  const [subscription, setSubscription] = useState("");

  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    country: "",
    city: "",
    street_address: "",
    postal_code: "",
    subscription_id: null,
  });

  const handleNext = () => {
    setStep((prev) => (prev === "step-1" ? "step-2" : "step-3"));
  };

  const handleBack = () => {
    setStep((prev) => (prev === "step-3" ? "step-2" : "step-1"));
  };

  const stepHeadings: Record<string, string> = {
    "step-1": "Choose Subscription",
    "step-2": "Fill In User Information",
    "step-3": "Stripe Integration",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let customer = await fetchUserByEmailHandler(user.email);
      if (!customer) {
        customer = await createUserHandler(user);
        if (customer) {
          // TODO: payment+couple between subcription and user
          handleNext();
        } else {
          setError("Failed to create user");
        }
      } else {
        setError("Email is already in use");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
    }
  };

  return (
    <div className="container">
      <h2>{stepHeadings[step]}</h2>
      {error && <h3 className="error">{error}</h3>}
      {step === "step-1" && (
        <ChooseSubscription
          subscription={subscription}
          setSubscription={setSubscription}
          handleNext={handleNext}
        />
      )}
      {step === "step-2" && <CustomerForm user={user} setUser={setUser} />}
      {step === "step-3" && (
        <StripeSub user={user} subscription={subscription} />
      )}

      <div className="button-div">
        {step !== "step-1" && <button onClick={handleBack}>Previous</button>}
        {step === "step-1" && <button onClick={handleNext}>Next</button>}
        {step === "step-2" && <button onClick={handleSubmit}>Checkout</button>}
      </div>
    </div>
  );
};
