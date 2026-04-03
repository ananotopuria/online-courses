import StarIcon from "./../../assets/starsicon.png";
import BookIcon from "./../../assets/bookicon.png";
import Avatar from "./../../assets/Avatar.png";
import { Link } from "react-router-dom";

function Nav() {
  const isLoggedIn = true;
  return (
    <nav>
      <ul className="flex gap-14 justify-center items-center">
        <li className="flex gap-2 cursor-pointer">
          <Link to="/courses" className="flex gap-2 cursor-pointer">
            <img src={StarIcon} className="w-6 h-6" />
            <span>Browse Courses</span>
          </Link>
        </li>
        {isLoggedIn && (
          <li className="flex gap-4">
            <button className="border border-primary text-primary px-5 py-4 rounded-lg cursor-pointer">
              Log in
            </button>
            <button className="bg-primary-dark text-surface px-5 py-4 rounded-lg cursor-pointer">
              Sign Up
            </button>
          </li>
        )}
        {!isLoggedIn && (
          <>
            <li className="flex gap-2 cursor-pointer">
              <Link to="/courses" className="flex gap-2 cursor-pointer">
                <img src={BookIcon} className="w-6 h-6" />
                <span>Enrolled Courses</span>
              </Link>
            </li>
            <li>
              {" "}
              <img src={Avatar} className="w-16 h-16" alt="Avatar" />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
