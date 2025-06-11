import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import Logo from "../assets/second-logo.png";

export const RenderFooterInfo = () => {
  return (
    <>
      <div className="footer_container">
        <div className=" footer_icons">
          <FontAwesomeIcon className="icons" icon={faFacebook} />
          <FontAwesomeIcon className="icons" icon={faTwitter} />
          <FontAwesomeIcon className="icons" icon={faInstagram} />
        </div>
        <ul className="footer_links">
          <li>
            <Link to={"/admin"}>Admin</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/subscription"}>Subscribe</Link>
          </li>
        </ul>

        <div><img id="footer-logo" src={Logo} /></div>
        <div className="footer_copyright">
          <p>
            © 1996–2025 Totally Confused Socks. All rights reserved
          </p>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
    </>
  );
};
