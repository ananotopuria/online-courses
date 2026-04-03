import { Link } from "react-router-dom";
import Logo from "./../../assets/Logo.png";
import Nav from "./Nav";

function Header() {
  return (
    <header className="bg-bg flex justify-between items-center px-30 py-6 h-27 border-b border-[#D1D1D1]">
      <Link to="/">
        <img src={Logo} className="w-16 h-16" alt="Logo" />
      </Link>
      <Nav />
    </header>
  );
}

export default Header;
