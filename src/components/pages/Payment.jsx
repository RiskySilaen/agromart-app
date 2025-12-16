import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";

// 1. IMPORT GAMBAR ASET LOKAL
import bananaImg from "../../assets/buah_banana.jpg";
import apelImg from "../../assets/apel.jpg";
import tomatImg from "../../assets/buah_tomat.jpg";
import semangkaImg from "../../assets/semangka.jpg";
import wortelImg from "../../assets/wortel.jpg";
import nanasImg from "../../assets/nanas.jpg";
import cabeMerahImg from "../../assets/cabe_merah.jpg";
import cabeHijauImg from "../../assets/cabe_hijau.jpg";
import anggurImg from "../../assets/anggur.jpg";
import jerukImg from "../../assets/jeruk.jpg";
import buncisImg from "../../assets/buncis.jpg";
import logoAgromart from "../../assets/logo_agromart.png"; 

// 2. MAPPING GAMBAR
const productImages = {
  "Banana": bananaImg,
  "Apel": apelImg,
  "Tomat": tomatImg,
  "Semangka": semangkaImg,
  "Wortel": wortelImg,
  "Nanas": nanasImg,
  "Cabe Merah": cabeMerahImg,
  "Cabe Hijau": cabeHijauImg,
  "Anggur": anggurImg,
  "Jeruk": jerukImg,
  "Buncis": buncisImg,
};

function Payment({ showNotification, db: database }) {
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("gopay");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = database.getCurrentUser();

    // --- PROTEKSI HALAMAN: CEK LOGIN ---
    if (!user) {
      showNotification("Anda harus login untuk mengakses halaman ini", "error");
      navigate("/login");
      return;
    }
    // -----------------------------------

    const cartItems = database.getCart();
    setCart(cartItems);
    setCurrentUser(user);
  }, []);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const selectPayment = (method) => {
    setSelectedPayment(method);
  };

  // --- FUNGSI UTAMA: MENYAMBUNGKAN KE WHATSAPP ---
  const processPayment = () => {
    if (!selectedPayment) {
      showNotification("Pilih metode pembayaran terlebih dahulu", "error");
      return;
    }

    if (cart.length === 0) {
      showNotification("Keranjang belanja kosong", "error");
      return;
    }

    // 1. Simpan Order ke Database dulu (untuk riwayat)
    const result = database.saveOrder(selectedPayment);
    
    if (result.success) {
      showNotification("Mengarahkan ke WhatsApp Admin...", "success");

      // 2. Siapkan Nomor WA Admin (GANTI DENGAN NOMOR ASLI ANDA)
      // Gunakan kode negara '62' tanpa tanda '+'
      const adminPhoneNumber = "6282199690715"; 

      // 3. Buat Format Pesan Otomatis
      let message = `Halo Admin *Sayang Agromart*! 👋\n\n`;
      message += `Saya *${currentUser.name}* ingin menyelesaikan pesanan.\n\n`;
      message += `📋 *Detail Pesanan:*\n`;
      
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n`;
      });

      message += `\n💰 *Total: Rp ${result.order.total.toLocaleString("id-ID")}*\n`;
      message += `💳 *Metode Bayar: ${selectedPayment.toUpperCase()}*\n\n`;

      // Tambahkan instruksi sesuai metode bayar
      if (selectedPayment === "gopay") {
        message += `Mohon infokan nomor *GOPAY* atau QRIS untuk transfer pembayaran.`;
      } else if (selectedPayment === "dana") {
        message += `Mohon infokan nomor *DANA* tujuan untuk transfer.`;
      } else {
        message += `Mohon diproses, terima kasih!`;
      }

      // 4. Buka Link WhatsApp
      const waUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Delay sedikit agar user lihat notifikasi dulu
      setTimeout(() => {
        window.open(waUrl, "_blank");
        // Opsional: Langsung arahkan kembali ke home atau biarkan di sini
        navigate("/"); 
      }, 1000);

    } else {
      showNotification(result.message, "error");
    }
  };

  const cancelOrder = () => {
    if (window.confirm("Batalkan pesanan?")) {
      database.clearCart();
      showNotification("Pesanan dibatalkan");
      navigate("/order");
    }
  };

  const editOrder = () => {
    navigate("/order");
  };

  return (
    <section className="container mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <div className="bg-gray-100 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row relative min-h-[500px]">
        
        {/* BAGIAN KIRI (TOTAL & TOMBOL BAYAR) */}
        <div className="bg-white border-4 border-blue-400 p-6 w-full md:w-1/3 flex flex-col items-center justify-center text-center relative z-10">
          <h2 className="font-serif text-xl mb-6">PEMBAYARAN</h2>
          <div className="w-40 h-40 rounded-full border-2 border-agro-green bg-white mb-8 overflow-hidden flex items-center justify-center p-2">
             {/* Logo */}
             <img 
                src={logoAgromart} 
                alt="Logo" 
                className="w-full h-full object-contain" 
             />
          </div>
          <div className="mb-4">
            <div className="text-gray-400 text-lg">total</div>
            <div className="text-2xl font-bold text-gray-800">
              Rp {getCartTotal().toLocaleString("id-ID")}
            </div>
          </div>
          <button
            onClick={processPayment}
            className="bg-agro-green/80 hover:bg-agro-green text-white px-10 py-2 rounded-lg font-bold transition transform hover:scale-105"
          >
            BAYAR SEKARANG
          </button>
        </div>

        {/* BAGIAN TENGAH (DAFTAR PESANAN) */}
        <div className="p-6 w-full md:w-1/3 flex flex-col">
          <div className="text-right mb-4">
            <span className="text-sm font-bold mr-2">
              {currentUser ? currentUser.name : "Guest"}
            </span>
            <i className="fa-solid fa-circle-user text-2xl align-middle text-agro-green"></i>
          </div>
          <h3 className="font-serif text-sm font-bold mb-4">pesanan anda:</h3>

          <div className="space-y-4 text-xs overflow-y-auto max-h-[250px] custom-scroll pr-2 mb-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Tidak ada pesanan
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={item.productId} className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <span>{index + 1}.</span>
                  {/* TAMPILKAN GAMBAR PRODUK */}
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={item.image || productImages[item.name] || logoAgromart} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {e.target.src = logoAgromart}}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-[10px] text-gray-500">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="font-bold">x {item.quantity}</div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={cancelOrder}
              className="bg-red-500 text-white text-[10px] py-2 px-4 rounded hover:bg-red-600 flex-1 text-center leading-tight transition"
            >
              Batalkan
              <br />
              pesanan
            </button>
            <button
              onClick={editOrder}
              className="bg-agro-green text-white text-[10px] py-2 px-4 rounded hover:bg-green-800 flex-1 text-center leading-tight transition"
            >
              Edit
              <br />
              pesanan
            </button>
          </div>
        </div>

        {/* BAGIAN KANAN (METODE PEMBAYARAN) */}
        <div className="bg-white rounded-l-[3rem] p-6 w-full md:w-1/3 flex flex-col items-center justify-center shadow-[-10px_0_20px_rgba(0,0,0,0.05)] relative md:-ml-4">
          <h3 className="text-gray-500 text-sm mb-6">Pilih Metode Pembayaran</h3>
          <div className="space-y-4 w-full px-8">
            <button
              onClick={() => selectPayment("gopay")}
              className={`w-full border rounded-xl p-3 flex items-center justify-between hover:bg-blue-50 transition transform hover:-translate-y-1 ${
                selectedPayment === "gopay"
                  ? "border-agro-green bg-blue-50 ring-2 ring-agro-green"
                  : "border-gray-200"
              }`}
            >
              <span className="font-bold text-blue-600">GOPAY</span>
              {selectedPayment === "gopay" && <i className="fa-solid fa-check-circle text-agro-green"></i>}
            </button>

            <button
              onClick={() => selectPayment("dana")}
              className={`w-full border rounded-xl p-3 flex items-center justify-between hover:bg-blue-50 transition transform hover:-translate-y-1 ${
                selectedPayment === "dana"
                  ? "border-agro-green bg-blue-50 ring-2 ring-agro-green"
                  : "border-gray-200"
              }`}
            >
              <span className="font-bold text-blue-400">DANA</span>
              {selectedPayment === "dana" && <i className="fa-solid fa-check-circle text-agro-green"></i>}
            </button>

            <button
              onClick={() => selectPayment("whatsapp")}
              className={`w-full border rounded-xl p-3 flex items-center justify-between hover:bg-green-50 transition transform hover:-translate-y-1 ${
                selectedPayment === "whatsapp"
                  ? "border-agro-green bg-green-50 ring-2 ring-agro-green"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <i className="fa-brands fa-whatsapp text-xl"></i> WhatsApp
              </div>
              {selectedPayment === "whatsapp" && <i className="fa-solid fa-check-circle text-agro-green"></i>}
            </button>
          </div>
          
          <div className="mt-8 text-center bg-gray-50 p-3 rounded-lg w-full text-xs text-gray-500">
            <p className="mb-1">Pembayaran akan diteruskan ke</p>
            <p className="font-bold text-gray-700">WhatsApp Admin</p>
            <p className="mt-1">Untuk konfirmasi transfer</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Payment;