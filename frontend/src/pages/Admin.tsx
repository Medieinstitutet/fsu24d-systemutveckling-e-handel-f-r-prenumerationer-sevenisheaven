import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const Admin = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/admin/products");
    } catch (error) {
      alert("Invalid username or password! Please try again.");
    }
  };

  return (
    <>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} id="admin-login">
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
        <button type="submit">Login</button>
        <button
          type="button"
          onClick={async () => {
            try {
              await register(username, password);
              alert("Registration successful! You are now logged in.");
              navigate("/admin/products");
            } catch (error: any) {
              alert(
                error.message ||
                  "Registration failed. Try a different username."
              );
            }
          }}
        >
          Register
        </button>
      </form>
    </>
  );
};
