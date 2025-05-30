import { NavLink } from "react-router";
export const Nav = () => {
  return (
    <section id="nav">
      <NavLink to={"/login"}>Login</NavLink>
      <NavLink to={"/subscription"}><div id="button-style">Subscription</div></NavLink>
    </section>
  );
};
