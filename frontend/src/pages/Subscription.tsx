import { FormEvent, useState } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { useUser } from "../hooks/useUsers";
import { OrderConfirmation } from "./OrderConfirmation";

export const Subscription = () => {
  const { fetchUserByEmailHandler, createUserHandler } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3" | "step-4">(
    "step-1"
  );
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
    subscription_id: "68380992c659b1a48ce18928",
  });

  const handleNext = () => {
    if (step === "step-1") setStep("step-2");
    else if (step === "step-2") setStep("step-3");
    else if (step === "step-3") setStep("step-4");
  };

  const handleBack = () => {
    if (step === "step-4") setStep("step-3");
    else if (step === "step-3") setStep("step-2");
    else if (step === "step-2") setStep("step-1");
  };

  const stepHeadings: Record<string, string> = {
    "step-1": "Choose Subscription",
    "step-2": "Fill In User Information",
    "step-3": "Stripe Integration",
    "step-4": "Order Confirmation",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let customer = await fetchUserByEmailHandler(user.email);
      if (!customer) {
        customer = await createUserHandler(user);
        if (customer) {
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
    <>
      <div className="container">
        <h2>{stepHeadings[step]}</h2>
      <h3 className="error">{error}</h3>
        {step === "step-1" && (
          <>
            <h2>1 - Sock Emergency</h2>
            <h2>2 - Sock & Roll</h2>
            <h2>3 - Sock Royalty</h2>
          </>
        )}
        <>
          {step === "step-2" && <CustomerForm user={user} setUser={setUser} />}
        </>
        <>
          {step === "step-4" && <OrderConfirmation />}
        </>
        <div className="button-div">
          {step === "step-1" && <button onClick={handleNext}>Next</button>}
          {step === "step-2" && <button onClick={handleBack}>Previous</button>}
          {step === "step-2" && (
            <button
              onClick={(e) => {
                handleSubmit(e);
                setError("")
              }}
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </>
  );
};
