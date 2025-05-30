import { Nav } from "../components/Nav";
import Logo from "../assets/logo.png";
import { NavLink, Outlet } from "react-router";

import { RenderFooterInfo } from "../components/RenderFooterInfo";

export const Layout = () => {
  return (
    <>
      <header>
        <NavLink to={"/"}>
          <img id="header-logo" src={Logo} />
        </NavLink>
        <Nav />
      </header>
      <Outlet />
      <footer>
        <RenderFooterInfo></RenderFooterInfo>
      </footer>
    </>
  );
};
