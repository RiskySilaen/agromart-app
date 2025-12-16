import React from "react";
import { useNavigate } from "react-router-dom";

// 1. IMPORT DATABASE (PENTING UTK CEK LOGIN)
import { db } from "../../services/database";

// Pastikan file gambar ini ada di folder assets
import heroImg from "../../assets/logo_agromart.png";

// 2. TERIMA PROPS showNotification
function Home({ showNotification }) {
  const navigate = useNavigate();

  const handleJoinPartner = () => {
    // 3. LOGIKA CEK LOGIN
    const user = db.getCurrentUser();

    if (!user) {
      // Jika belum login, munculkan notifikasi merah dan lempar ke halaman Login
      if (showNotification) {
        showNotification("Silakan Login atau Daftar terlebih dahulu untuk menghubungi Admin", "error");
      }
      navigate("/login");
      return; // Stop, jangan lanjut ke WA
    }

    // --- JIKA SUDAH LOGIN, BARU BUKA WA ---
    const phoneNumber = "6282199690715"; // Nomor Anda
    
    // Pesan lebih personal dengan nama user
    const message = `Halo Admin Agromart, saya ${user.name} (Petani) dan ingin menjual hasil panen saya di aplikasi ini. Bagaimana caranya?`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="container mx-auto p-6 mt-4">
        <div className="bg-agro-green rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          
          {/* Hiasan Latar Belakang */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -ml-20 -mb-20"></div>

          {/* Teks Hero */}
          <div className="text-white z-10 max-w-lg mb-10 md:mb-0">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Segar dari <br />
              <span className="text-yellow-300">Ladang Petani</span>
            </h1>
            <p className="mb-8 text-green-100 text-lg">
              Dapatkan sayur dan buah berkualitas terbaik langsung diantar ke depan pintu rumah Anda.
            </p>
            <button 
              onClick={() => navigate("/order")}
              className="bg-white text-agro-green font-bold py-4 px-10 rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 transition transform duration-300 flex items-center gap-2"
            >
              Belanja Sekarang <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* --- GAMBAR HERO --- */}
          <div className="z-10 relative">
            {/* Lingkaran Putih sebagai bingkai */}
            <div className="w-72 h-72 md:w-96 md:h-96 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-8 border-white/20">
               <img 
                src={heroImg} 
                alt="Sayuran Segar" 
                className="w-full h-full object-cover transform scale-110 hover:scale-125 transition duration-500"
                onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop";
                }}
               />
            </div>
          </div>
          {/* ----------------------------- */}

        </div>
      </section>

      {/* 2. SECTION KHUSUS PETANI */}
      <section className="container mx-auto p-6">
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-8 border-orange-500 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-md hover:shadow-xl transition duration-300">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shrink-0">
              <i className="fa-solid fa-tractor text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-serif">Apakah Anda Petani?</h2>
              <p className="text-gray-600 mt-1">
                Mari bermitra dengan Sayang Agromart! Jual hasil panen Anda dengan harga terbaik tanpa perantara.
              </p>
            </div>
          </div>
          <button 
            onClick={handleJoinPartner}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            Hubungi Admin
          </button>
        </div>
      </section>

      {/* 3. SECTION KEUNGGULAN */}
      <section className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-lg transition text-center border border-green-50">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-agro-green text-2xl">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Pengiriman Cepat</h3>
          <p className="text-sm text-gray-500">Sayur tetap segar sampai di tangan Anda dalam waktu singkat.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-lg transition text-center border border-green-50">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600 text-2xl">
            <i className="fas fa-medal"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Kualitas Terbaik</h3>
          <p className="text-sm text-gray-500">Dipetik langsung dari petani lokal pilihan dengan standar tinggi.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-lg transition text-center border border-green-50">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">
            <i className="fas fa-headset"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Layanan 24/7</h3>
          <p className="text-sm text-gray-500">Tim kami siap membantu pesanan Anda kapan saja.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;