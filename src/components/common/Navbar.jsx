import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Navbar({ currentUser, onLogout, showNotification }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="bg-agro-green text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6 text-2xl">
          <button onClick={goBack} className="hover:text-gray-300">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <Link to="/" className="hover:text-gray-300">
            <i className="fa-solid fa-house"></i>
          </Link>
        </div>

        <div className="hidden md:flex space-x-10 font-serif text-sm tracking-widest">
          <Link
            to="/contact"
            className="hover:underline underline-offset-4 uppercase"
          >
            KONTAK
          </Link>
          <Link
            to="/products"
            className="hover:underline underline-offset-4 uppercase"
          >
            PRODUK
          </Link>
          <Link
            to="/order"
            className="hover:underline underline-offset-4 uppercase"
          >
            ORDER
          </Link>

          {currentUser ? (
            <>
              <span className="text-green-300">Hi, {currentUser.name}</span>
              <button
                onClick={handleLogout}
                className="hover:underline underline-offset-4 uppercase text-red-300"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:underline underline-offset-4 uppercase"
            >
              LOGIN
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <i className="fa-solid fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
