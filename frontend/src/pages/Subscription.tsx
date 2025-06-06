import { FormEvent, useEffect, useState } from "react";
import { CustomerForm } from "../components/CustomerForm";
import { useUser } from "../hooks/useUsers";
import { API_URL } from "../services/baseService";

export const Subscription = () => {
  const { fetchUserByEmailHandler, createUserHandler, updateUserHandler, user: contextUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3" | "step-4">(
    "step-1"
  );
  const [subscriptions, setSubscriptions] = useState<{ loading: boolean; list: Array<{ _id: string; level_name: string; tier: number }> }>({ loading: false, list: [] });
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
    subscription_id: contextUser?.subscription_id._id || "",
  });

  useEffect(() => {
    //TODO: MAYBE error handling for failed request or empty array??
    if (subscriptions.list.length === 0 && !subscriptions.loading) {
      setSubscriptions({ list: [], loading: true })
      fetch(`${API_URL}/subscriptions`).then((r) => r.json()).then(list => {
        setSubscriptions({ list, loading: false })
      }).catch(() => {
        alert('Something went wrong!')
      })
    }
  }, [subscriptions])

  const handleNext = () => {
    if (step === "step-1") {
      if (contextUser) {
        // TODO: SHOULD THIS UPDATE BE DONE AFTER PAYMENT INSTEAD MAYBE?
        updateUserHandler(contextUser.email, { subscription_id: user.subscription_id })
        setStep("step-3");
      } else {
        setStep("step-2");
      }
    }
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
    <>
      <div className="container">
        <h2>{stepHeadings[step]}</h2>
      <h3 className="error">{error}</h3>
        {step === "step-1" && (
          subscriptions.loading ? (
          <>
            <h2>Fetching subscriptions...</h2>
          </>
          ) : (
          <center style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {subscriptions.list.map((subscription) => {
            const isActive = subscription._id === user.subscription_id
            return (
              <button key={subscription._id} disabled={isActive} style={{ background: isActive ? 'lightgreen': 'white' }} onClick={() => {
                setUser({ ...user, subscription_id: subscription._id })
                handleNext()
                }}>
                {subscription.level_name}
                <br />
                ${subscription.tier}
              </button>
            )
            })}
          </center>
          )
        )}
        <>
          {step === "step-2" && <CustomerForm user={user} setUser={setUser} />}
        </>
        <div className="button-div">
          {step === "step-1" && user.subscription_id && <button onClick={handleNext}>Next</button>}
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
