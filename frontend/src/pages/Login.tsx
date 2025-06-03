import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [typeOfLogin, setTypeOfLogin] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(email, password, typeOfLogin);
    navigate(typeOfLogin === "customer" ? "/my-page" : "/admin");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Invalid email or password! Please try again.");
  }
};
  
  return (
    <>
      <h2>{typeOfLogin === "customer" ? "User Login" : "Admin Login"}</h2>
      <h3 className="error">{error}</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="button-div">
          <button type="submit">Login</button>
          <button
            type="button"
            onClick={() =>
              setTypeOfLogin((prev) => (prev === "customer" ? "admin" : "customer"))
            }
          >
           {typeOfLogin === "customer" ? "Admin" : "Customer"} Login
          </button>
        </div>
      </form>
    </>
  );
};