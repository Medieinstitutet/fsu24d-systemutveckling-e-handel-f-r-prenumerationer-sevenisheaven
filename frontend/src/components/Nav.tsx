import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Nav = () => {
  const { user } = useAuth();

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
        <NavLink to="/products">Socks</NavLink>
        <NavLink to="/my-page">My Page</NavLink>
        <NavLink to="/subscription">
          <div id="button-style">Subscription</div>
        </NavLink>
        <NavLink to={"/cart"}>
          <div id="button-style">Your weekly sock</div>
        </NavLink>
      </section>
    );
  }

  if (user.role === "admin") {
    return (
      <section id="nav">
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin">My Page</NavLink>
      </section>
    );
  }
};
