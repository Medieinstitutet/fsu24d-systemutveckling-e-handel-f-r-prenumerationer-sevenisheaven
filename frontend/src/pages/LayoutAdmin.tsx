import { Outlet } from "react-router-dom"
import Logo from "../assets/logo.png"
import { NavAdmin } from "../components/NavAdmin"

export const LayoutAdmin = () => {
       return (
        <>
            <header>
                <img id="header-logo" src={Logo} />
                <NavAdmin />
               </header>
               <Outlet/>
        </>
    )
}