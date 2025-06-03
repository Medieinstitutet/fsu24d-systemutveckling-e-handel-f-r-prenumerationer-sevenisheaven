import { Nav } from "../components/Nav";
import Logo from "../assets/logo.png";
import { NavLink, Outlet, useNavigate } from "react-router";

import { RenderFooterInfo } from "../components/RenderFooterInfo";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export const Layout = () => {
  const { user, logout } = useAuth();

  const {emptyHandler} = useCart()

  const navigate = useNavigate();
  
   const handleLogout = async () => {
    emptyHandler()
    await logout();
    navigate("/");
  };

  return (
    <>
      <div className="main_container">
        {user ? (
          <>
            <h4>Logged in {user.role}: {user.email} </h4><button id="loggout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          ""
        )}
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
