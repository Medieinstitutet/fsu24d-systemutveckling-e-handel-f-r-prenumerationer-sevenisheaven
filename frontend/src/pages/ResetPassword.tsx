import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/baseService";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/password/reset-password`, {
        token,
        password,
      });
        setMessage(res.data.message || "Password reset successful!");
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error || "Something went wrong. Try again.";
      setError(errMsg);
    }
  };

  return (<>
      <h2>Reset Your Password</h2>
      {error && <h3 className="error">{error}</h3>}
      {message && <h3 className="success">{message}</h3>}
      <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      </form>
    </>
  );
}