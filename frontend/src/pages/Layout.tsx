import { Nav } from "../components/Nav";
import Logo from "../assets/logo.png";
import { NavLink, Outlet } from "react-router";

import { RenderFooterInfo } from "../components/RenderFooterInfo";
import { useAuth } from "../hooks/useAuth";

export const Layout = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="main_container">
        {user ? `Logged in ${user.role}: ${user.email}` : ""}
        <header>
          <NavLink to={"/"}>
            <img id="header-logo" src={Logo} />
          </NavLink>
          <Nav />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <RenderFooterInfo></RenderFooterInfo>
        </footer>
      </div>
    </>
  );
};
