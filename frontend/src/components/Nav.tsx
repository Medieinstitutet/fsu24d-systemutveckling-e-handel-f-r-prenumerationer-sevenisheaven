import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <section id="nav">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/subscription">
          <div id="button-style">Subscription</div>
        </NavLink>
      </section>
    );
  }

  if (user.role === "customer") {
    return (
      <section id="nav">
        <button onClick={handleLogout}>Logout</button>
        <NavLink to="/products">Socks</NavLink>
        <NavLink to="/subscription">
          <div id="button-style">Subscription</div>
        </NavLink>
      </section>
    );
  }

  if (user.role === "admin") {
    return (
      <section id="nav">
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/users">Users ❌</NavLink>
        <NavLink to="/subscriptions">Subscriptions ❌</NavLink>
        <button onClick={handleLogout}>Logout</button>
      </section>
    );
  }
};