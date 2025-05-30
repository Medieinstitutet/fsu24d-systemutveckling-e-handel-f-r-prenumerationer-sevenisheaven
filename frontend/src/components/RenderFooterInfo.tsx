import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

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
            <Link to={"/about-us"}>Admin</Link>
          </li>
          <li>
            <Link to={"/about-us"}>Login</Link>
          </li>
          <li>
            <Link to={"/about-us"}>Subscribe</Link>
          </li>
        </ul>

        <div>LOGO</div>
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
