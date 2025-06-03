import { NavLink } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const Nav = () => {
  const { user, logout } = useAuth();

  return (
    <section id="nav">
      {!user ? (
        <>
          <NavLink to={"/login"}>Login</NavLink>
          <NavLink to={"/subscription"}>
            <div id="button-style">Subscription</div>
          </NavLink>
        </>
      ) : (
        <>
            <button onClick={logout}>Logout</button>
            <NavLink to={"/products"}>Socks</NavLink>
          <NavLink to={"/subscription"}>
            <div id="button-style">Subscription</div>
          </NavLink>
          <NavLink to={"/cart"}>
            <div id="button-style">Your weekly sock</div>
          </NavLink>
        </>
      )}
    </section>
  );
};