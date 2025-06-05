import { FormEvent, useState } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { useUser } from "../hooks/useUsers";
import { StripeSub } from "../components/StripeSub";

export const Subscription = () => {
  const { fetchUserByEmailHandler, createUserHandler } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3" >("step-1");

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
    subscription_id: "",
  });

  const handleNext = () => {
    setStep((prev) =>
      prev === "step-1" ? "step-2" : "step-3"
    );
  };

  const handleBack = () => {
    setStep((prev) =>
      prev === "step-3" ? "step-2" : prev === "step-2" ? "step-2" : "step-1"
    );
  };

  const stepHeadings: Record<string, string> = {
    "step-1": "Choose Subscription",
    "step-2": "Fill In User Information",
    "step-3": "Stripe Integration",
    "step-4": "Order Confirmation",
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError("");
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
    setError("Something went wrong during checkout.");
  }
};

  return (
    <div className="container">
      <h2>{stepHeadings[step]}</h2>
      {error && <h3 className="error">{error}</h3>}

      {step === "step-1" && (
  <div className="subscriptions">
    <button
      onClick={() => {
              setUser({ ...user, subscription_id: "68380950c659b1a48ce18927" });
              handleNext();
      }}
    >
      1 - Sock Emergency
    </button>
    <button
      onClick={() => {
              setUser({ ...user, subscription_id: "68380992c659b1a48ce18928" });
              handleNext();
      }}
    >
      2 - Sock & Roll
    </button>
    <button
      onClick={() => {
              setUser({ ...user, subscription_id: "683809b3c659b1a48ce18929" });
              handleNext();
      }}
    >
      3 - Sock Royalty
    </button>
  </div>
)}

      {step === "step-2" && <CustomerForm user={user} setUser={setUser} />}
      {step === "step-3" && <StripeSub user={user} />}

      <div className="button-div">
        {step !== "step-1" && <button onClick={handleBack}>Previous</button>}
        {step === "step-1" && <button onClick={handleNext}>Next</button>}
        {step === "step-2" && (
          <button onClick={handleSubmit}>Checkout</button>
        )}
      </div>
    </div>
  );
};