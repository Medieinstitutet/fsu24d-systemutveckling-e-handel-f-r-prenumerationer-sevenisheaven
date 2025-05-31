import { useState } from "react";
import { CountrySelect } from "../components/CountrySelect";

export const Subscription = () => {
  const [step, setStep] = useState<"step-1" | "step-2" | "step-3" | "step-4">("step-1");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

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
    
    
  return (
    <div className="container">
          <h2>{stepHeadings[step]}</h2>
          {step === "step-1" && (
              <>
                  <h2>1 - Sock Emergency</h2>
                  <h2>2 - Sock & Roll</h2>
                  <h2>3 - Sock Royalty</h2>
              </>
              )}
          <>
              {step === "step-2" && (
                  <form>
                      <h3>Login Details</h3>
                      <input
                          placeholder="E-mail"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                      <input
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                      <h3>Personal Information</h3>
                      <input
                          placeholder="Firstname"
                          type="text"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                      />
                      <input
                          placeholder="Lastname"
                          type="text"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                      />
                      <input
                          placeholder="Phonenumber"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                      />
                      <h3>Shipping Address</h3>
                      <select
                          required
                          defaultValue={country}
                          onChange={(e) => setCountry(e.target.value)}
                      >
                          <CountrySelect />
                      </select>
                      <input
                          placeholder="City"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                      />
                      <input
                          placeholder="Address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                      />
                      <input
                          placeholder="Postal Code"
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                      />
                  </form>)}
          </>
          <div className="button-div">
              {step === "step-1" && (<button onClick={handleNext}>Next</button>)}
              {step === "step-2" && (<button onClick={handleBack}>Previous</button>)}
              {step === "step-2" && (<button onClick={handleNext}>Checkout</button>)}
          </div>
    </div>
  );
};
