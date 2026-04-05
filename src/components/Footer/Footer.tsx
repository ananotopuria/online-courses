import Logo from "./../../assets/Logo.png";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiInstagramFill } from "react-icons/ri";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-bg px-30 py-6 border-t border-[#D1D1D1]">
      <div className="flex justify-between">
        <div className="flex flex-col bg-red-500">
          <div className="flex items-center gap-2">
            <img src={Logo} className="w-16 h-16" alt="logo" />
            <p className="text-secondary-text">Bootcamp</p>
          </div>
          <p className="text-secondary-text">
            Your learning journey starts here! Browse courses to get started.
          </p>
          <ul className="flex gap-6 text-[#736BEA]">
            <li>
              <Link to="/">
                <FaFacebookF />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FaTwitter />
              </Link>
            </li>
            <li>
              <Link to="/">
                <RiInstagramFill />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FaLinkedinIn />
              </Link>
            </li>
            <li>
              <Link to="/">
                <FaYoutube />
              </Link>
            </li>
          </ul>
        </div>
        <nav className="flex gap-20">
          <div>
            <h4 className="text-secondary-text">Explore</h4>
            <ul>
              <li>
                <a href="#">Enrolled Courses</a>
              </li>
              <li>
                <a href="#">Browse Courses</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Account</h4>
            <ul>
              <li>
                <a href="#">My Profile</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <address>
              <ul>
                <li>
                  <a href="mailto:contact@company.com">contact@company.com</a>
                </li>
                <li>
                  <a href="tel:+995555111222">(+995) 555 111 222</a>
                </li>
                <li>Aghmashenebeli St.115</li>
              </ul>
            </address>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
