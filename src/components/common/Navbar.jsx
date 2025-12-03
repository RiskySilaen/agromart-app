import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Navbar({ currentUser, onLogout, showNotification }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false); // Tutup menu saat logout
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi untuk menutup menu saat link diklik
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-agro-green text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* BAGIAN KIRI: TOMBOL BACK & HOME */}
        <div className="flex space-x-6 text-2xl">
          <button onClick={goBack} className="hover:text-gray-300">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <Link to="/" className="hover:text-gray-300">
            <i className="fa-solid fa-house"></i>
          </Link>
        </div>

        {/* BAGIAN TENGAH: MENU DESKTOP (Hilang di HP) */}
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

        {/* BAGIAN KANAN: TOMBOL HAMBURGER (Hanya di HP) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {/* Ganti icon jadi X kalau menu terbuka */}
            <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* === MENU MOBILE (DROPDOWN) === */}
      {/* Hanya muncul jika isMenuOpen = true */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-agro-green shadow-xl border-t border-green-700 flex flex-col items-center py-4 space-y-4 font-serif text-sm tracking-widest animate-slideIn">
          <Link
            to="/contact"
            onClick={closeMenu}
            className="hover:text-green-300 w-full text-center py-2"
          >
            KONTAK
          </Link>
          <Link
            to="/products"
            onClick={closeMenu}
            className="hover:text-green-300 w-full text-center py-2"
          >
            PRODUK
          </Link>
          <Link
            to="/order"
            onClick={closeMenu}
            className="hover:text-green-300 w-full text-center py-2"
          >
            ORDER
          </Link>

          {currentUser ? (
            <>
              <span className="text-green-300 py-2 border-t border-green-600 w-full text-center mt-2">
                Hi, {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100 py-2 w-full text-center"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="hover:text-green-300 w-full text-center py-2 border-t border-green-600 mt-2"
            >
              LOGIN
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;