import { Nav } from "../components/Nav";
import Logo from "../assets/logo.png";
import { NavLink, Outlet } from "react-router";

import { RenderFooterInfo } from "../components/RenderFooterInfo";

export const Layout = () => {
  return (
    <>
      <div className="main_container">
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
