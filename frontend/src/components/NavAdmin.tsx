import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const NavAdmin = () => {
  const { logout } = useAuth();

  return (
    <section id="nav">
      <NavLink to={"/admin/products"}>Products</NavLink>
      <NavLink to={"/users"}>Users ❌</NavLink>
      <NavLink to={"/subscriptions"}>Subscriptions ❌</NavLink>
      <button onClick={logout}>Logout</button>
    </section>
  );
};