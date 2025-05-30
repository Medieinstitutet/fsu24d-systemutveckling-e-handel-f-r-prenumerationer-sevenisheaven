import { Nav } from "../components/Nav"
import Logo from "../assets/logo.png"

export const Layout = () => {
    return (
        <>
            <header>
                <img id="header-logo" src={Logo} />
                <Nav />
            </header>
        </>
    )
}