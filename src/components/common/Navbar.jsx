import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Navbar({ currentUser, onLogout, showNotification }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-agro-green text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* BAGIAN KIRI */}
        <div className="flex space-x-6 text-2xl">
          <button onClick={goBack} className="hover:text-gray-300">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <Link to="/" className="hover:text-gray-300">
            <i className="fa-solid fa-house"></i>
          </Link>
        </div>

        {/* BAGIAN TENGAH (DESKTOP) */}
        <div className="hidden md:flex space-x-10 font-serif text-sm tracking-widest">
          <Link to="/contact" className="hover:underline underline-offset-4 uppercase">KONTAK</Link>
          <Link to="/products" className="hover:underline underline-offset-4 uppercase">PRODUK</Link>
          <Link to="/order" className="hover:underline underline-offset-4 uppercase">ORDER</Link>

          {currentUser ? (
            <>
              <span className="text-green-300">Hi, {currentUser.name}</span>
              <button onClick={handleLogout} className="hover:underline underline-offset-4 uppercase text-red-300">LOGOUT</button>
            </>
          ) : (
            <Link to="/login" className="hover:underline underline-offset-4 uppercase">LOGIN</Link>
          )}
        </div>

        {/* BAGIAN KANAN (TOMBOL MENU HP) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* === MENU MOBILE === */}
      {/* Kode ini memastikan menu muncul di bawah navbar saat isMenuOpen = true */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-agro-green border-t border-green-700 shadow-xl flex flex-col items-center py-4 space-y-4 font-serif text-sm tracking-widest z-40">
          <Link to="/contact" onClick={closeMenu} className="hover:text-green-300 w-full text-center py-3">KONTAK</Link>
          <Link to="/products" onClick={closeMenu} className="hover:text-green-300 w-full text-center py-3">PRODUK</Link>
          <Link to="/order" onClick={closeMenu} className="hover:text-green-300 w-full text-center py-3">ORDER</Link>

          {currentUser ? (
            <>
              <span className="text-green-300 py-3 border-t border-green-600 w-full text-center mt-2">Hi, {currentUser.name}</span>
              <button onClick={handleLogout} className="text-red-300 hover:text-red-100 py-3 w-full text-center">LOGOUT</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="hover:text-green-300 w-full text-center py-3 border-t border-green-600 mt-2">LOGIN</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;