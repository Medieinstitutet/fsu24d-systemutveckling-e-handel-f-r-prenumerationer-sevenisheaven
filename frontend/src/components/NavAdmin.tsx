import { NavLink } from "react-router";
export const NavAdmin = () => {
  return (
    <section id="nav">
      <NavLink to={"/products"}>Products</NavLink>
      <NavLink to={"/users"}>Users ❌</NavLink>
      <NavLink to={"/subscriptions"}>Subscriptions ❌</NavLink>
    </section>
  );
};
