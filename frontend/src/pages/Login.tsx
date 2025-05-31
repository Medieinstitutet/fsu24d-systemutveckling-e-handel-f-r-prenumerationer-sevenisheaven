import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { login, register } = useAuth();
  const [typeOfLogin, setTypeOfLogin] = useState<"user" | "admin">("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate(typeOfLogin === "user" ? "/my-page" : "/admin");
    } catch (error) {
      alert("Invalid username or password! Please try again.");
    }
  };

  const handleRegister = async () => {
    try {
      await register(username, password);
      alert("Registration successful! You are now logged in.");
      navigate("/admin/products");
    } catch (error: any) {
      alert(error.message || "Registration failed. Try a different username.");
    }
  };

  return (
    <>
      <h2>{typeOfLogin === "user" ? "User Login" : "Admin Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          <button type="button" onClick={handleRegister}>
            Register
          </button>
          <button
            type="button"
            onClick={() =>
              setTypeOfLogin((prev) => (prev === "user" ? "admin" : "user"))
            }
          >
           {typeOfLogin === "user" ? "Admin" : "User"} Login
          </button>
        </div>
      </form>
    </>
  );
};