import { useState } from "react";
import { Link } from "react-router-dom";

import StarIcon from "./../../assets/starsicon.png";
import BookIcon from "./../../assets/bookicon.png";
import Avatar from "./../../assets/Avatar.png";
import { useMe } from "../../features/auth/hooks/useAuth";
import LoginModal from "../../features/auth/ui/LoginModal";
import RegisterModal from "../../features/auth/ui/RegisterModal";

function Nav() {
  const { data: me, isLoading } = useMe();

  // 🔑 თუ user არსებობს → logged in
  const isLoggedIn = !!me;

  // 🔥 ერთი state modal-ებისთვის
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null,
  );

  if (isLoading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <>
      <nav>
        <ul className="flex items-center justify-center gap-14">
          {/* Browse */}
          <li className="flex cursor-pointer gap-2">
            <Link to="/courses" className="flex cursor-pointer gap-2">
              <img src={StarIcon} className="h-6 w-6" alt="Browse courses" />
              <span>Browse Courses</span>
            </Link>
          </li>

          {/* ❌ NOT LOGGED IN */}
          {!isLoggedIn && (
            <li className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveModal("login")}
                className="cursor-pointer rounded-lg border border-primary px-5 py-4 text-primary"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("register")}
                className="cursor-pointer rounded-lg bg-primary-dark px-5 py-4 text-surface"
              >
                Sign Up
              </button>
            </li>
          )}

          {/* ✅ LOGGED IN */}
          {isLoggedIn && (
            <>
              <li className="flex cursor-pointer gap-2">
                <Link to="/courses" className="flex cursor-pointer gap-2">
                  <img
                    src={BookIcon}
                    className="h-6 w-6"
                    alt="Enrolled courses"
                  />
                  <span>Enrolled Courses</span>
                </Link>
              </li>

              <li>
                <img
                  src={me?.avatar || Avatar}
                  className="h-16 w-16 rounded-full object-cover"
                  alt="User avatar"
                />
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* 🔥 MODALS */}
      {activeModal === "login" && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onSwitchToRegister={() => setActiveModal("register")}
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onSwitchToLogin={() => setActiveModal("login")}
        />
      )}
    </>
  );
}

export default Nav;
