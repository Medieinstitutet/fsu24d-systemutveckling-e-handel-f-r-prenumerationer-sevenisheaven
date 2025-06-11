import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../services/baseService";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [typeOfLogin, setTypeOfLogin] = useState<"customer" | "admin">(
    "customer"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password, typeOfLogin);
      navigate(typeOfLogin === "customer" ? "/my-page" : "/admin");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password! Please try again."
      );
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/password/request-password-reset`, {
  email,
});
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <>
      <h2>{typeOfLogin === "customer" ? "User Login" : "Admin Login"}</h2>
      {error && <h3 className="error">{error}</h3>}
      {message && <h3 className="success">{message}</h3>}

      {!showResetForm ? (
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
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
                setTypeOfLogin((prev) =>
                  prev === "customer" ? "admin" : "customer"
                )
              }
            >
              {typeOfLogin === "customer" ? "Admin" : "Customer"} Login
            </button>
          </div>
          <button type="button" onClick={() => setShowResetForm(true)}>
            Forgot Password?
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="button-div">
            <button type="submit">Send Reset E-mail</button>
            <button type="button" onClick={() => setShowResetForm(false)}>
              Back
            </button>
          </div>
        </form>
      )}
    </>
  );
};
