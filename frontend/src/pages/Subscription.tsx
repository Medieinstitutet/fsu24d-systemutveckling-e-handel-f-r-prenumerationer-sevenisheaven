import { useState, FormEvent } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { StripeSub } from "../components/StripeSub";
import { ChooseSubscription } from "../components/ChooseSubscription";
import { useUser } from "../hooks/useUser";

export const Subscription = () => {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3">("step-1");
  const [subscription, setSubscription] = useState("");
  const { fetchUserByEmailHandler } = useUser();

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
    if (step === "step-1") setStep("step-2");
    else if (step === "step-2") setStep("step-3");
    setError(null);
  };

  const handleBack = () => {
    if (step === "step-3") setStep("step-2");
    else if (step === "step-2") setStep("step-1");
    setError(null);
  };

  const handleCheckEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!user.email || !user.firstname || !user.lastname) {
      setError("Please fill out all required fields");
      return;
    }

    try {
      const customer = await fetchUserByEmailHandler(user.email);
      if (customer) {
        setError("Email is already in use");
      } else {
        setError(null);
        handleNext();
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      setError("Something went wrong. Please try again");
    }
  };

  const stepHeadings: Record<string, string> = {
    "step-1": "Choose Subscription",
    "step-2": "Customer Information",
    "step-3": "Checkout",
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

      {step === "step-2" && (
        <CustomerForm user={user} setUser={setUser} />
      )}

      {step === "step-3" && (
        <StripeSub user={user} subscription={subscription} />
      )}

      <div className="button-div">
        {step !== "step-1" && (
          <button onClick={handleBack}>Previous</button>
        )}
        {step === "step-1" && (
          <button onClick={handleNext}>Next</button>
        )}
        {step === "step-2" && (
          <button type="button" onClick={handleCheckEmail}>Checkout</button>
        )}
      </div>
    </div>
  );
};