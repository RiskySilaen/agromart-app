import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../../services/database";

function Login({ showNotification, updateUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

 // Tambahkan 'async'
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tambahkan 'await'
    const result = await db.loginUser(formData.email, formData.password);

    if (result.success) {
      showNotification(`Selamat datang, ${result.user.name}!`);
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
          <h2 className="font-serif text-2xl font-bold mb-8 text-black/80 tracking-widest">
            LOG IN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              id="loginEmail"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />
            <input
              type="password"
              id="loginPassword"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-green-700 text-sm"
              required
            />

            <button
              type="submit"
              className="bg-green-100/80 hover:bg-white text-black font-bold py-2 px-10 rounded-full mt-4 shadow-lg transition w-full"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 text-xs text-white">
            belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-200 hover:text-white underline"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
