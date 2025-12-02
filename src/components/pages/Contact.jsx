import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";

function Contact({ showNotification }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    db.saveContact(
      formData.name,
      formData.email,
      formData.phone,
      formData.message
    );

    showNotification(
      "Pesan berhasil dikirim! Terima kasih atas feedback Anda."
    );

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <section className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl h-[500px]">
        <div className="bg-agro-green w-full md:w-1/2 p-8 flex flex-col items-center justify-center text-center text-white">
          <h2 className="font-serif text-2xl mb-6">KONTAK</h2>
          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8 border-4 border-white overflow-hidden">
            <i className="fas fa-leaf text-4xl text-agro-green"></i>
          </div>
          <p className="text-xs opacity-80 leading-relaxed px-4">
            saran dan tanggapan anda merupakan semangat untuk kami terus maju
            dan berkembang
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gray-50">
          <h2 className="font-bold text-xl text-center mb-6">Hubungi Kami</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border-none text-sm"
              required
            />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border-none text-sm"
              required
            />
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telepon"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border-none text-sm"
              required
            />
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Pesan"
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 border-none text-sm"
              required
            ></textarea>

            <div className="text-center">
              <button
                type="submit"
                className="bg-agro-green text-white px-8 py-2 rounded-full hover:bg-green-800 transition text-sm"
              >
                KIRIM
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;