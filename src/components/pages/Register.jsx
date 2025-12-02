import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";

function Register({ showNotification, updateUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tambahkan 'await'
   const result = await db.registerUser(
      formData.name,
      formData.email,
      formData.phone,
      formData.password
    );

    if (result.success) {
      showNotification(
        `Registrasi berhasil! Selamat datang, ${result.user.name}`
      );
      updateUser();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      showNotification(result.message, "error");
    }
  };

  return (
    <section className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-agro-green bg-white flex items-center justify-center overflow-hidden shadow-lg">
          <i className="fas fa-leaf text-7xl text-agro-green"></i>
        </div>

        <div className="bg-gradient-to-b from-green-200 via-agro-card-green to-agro-green p-8 rounded-[2rem] shadow-2xl w-full max-w-sm text-center relative">
          <h2 className="font-serif text-2xl font-bold mb-6 text-black/80 tracking-widest">
            DAFTAR
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              id="regName"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />
            <input
              type="email"
              id="regEmail"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />
            <input
              type="tel"
              id="regPhone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telepon"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />
            <input
              type="password"
              id="regPassword"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />

            <button
              type="submit"
              className="bg-green-100/80 hover:bg-white text-black font-bold py-2 px-10 rounded-full mt-6 shadow-lg transition w-full"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
