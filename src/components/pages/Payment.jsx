import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";

function Payment({ showNotification, db: database }) {
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("gopay");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cartItems = database.getCart();
    const user = database.getCurrentUser();
    setCart(cartItems);
    setCurrentUser(user);
  }, []);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const selectPayment = (method) => {
    setSelectedPayment(method);
  };

  const processPayment = () => {
    if (!selectedPayment) {
      showNotification("Pilih metode pembayaran terlebih dahulu", "error");
      return;
    }

    if (cart.length === 0) {
      showNotification("Keranjang belanja kosong", "error");
      return;
    }

    const result = database.saveOrder(selectedPayment);
    if (result.success) {
      showNotification(
        `Pembayaran berhasil! Total: Rp ${result.order.total.toLocaleString(
          "id-ID"
        )}`
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
        <div className="bg-white border-4 border-blue-400 p-6 w-full md:w-1/3 flex flex-col items-center justify-center text-center relative z-10">
          <h2 className="font-serif text-xl mb-6">PEMBAYARAN</h2>
          <div className="w-40 h-40 rounded-full border-2 border-agro-green bg-white mb-8 overflow-hidden flex items-center justify-center">
            <i className="fas fa-leaf text-6xl text-agro-green"></i>
          </div>
          <div className="mb-4">
            <div className="text-gray-400 text-lg">total</div>
            <div className="text-2xl font-bold text-gray-800">
              Rp {getCartTotal().toLocaleString("id-ID")}
            </div>
          </div>
          <button
            onClick={processPayment}
            className="bg-agro-green/80 hover:bg-agro-green text-white px-10 py-2 rounded-lg font-bold"
          >
            BAYAR
          </button>
        </div>

        <div className="p-6 w-full md:w-1/3 flex flex-col">
          <div className="text-right mb-4">
            <span className="text-sm font-bold">
              {currentUser ? currentUser.name : "Guest"}
            </span>
            <i className="fa-solid fa-circle-user text-2xl align-middle ml-2"></i>
          </div>
          <h3 className="font-serif text-sm font-bold mb-4">pesanan anda:</h3>

          <div className="space-y-4 text-xs overflow-y-auto max-h-[250px] custom-scroll pr-2 mb-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Tidak ada pesanan
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={item.productId} className="flex items-center gap-2">
                  <span>{index + 1}.</span>
                  <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                    <i className="fas fa-apple-alt text-sm text-agro-green"></i>
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
              className="bg-red-500 text-white text-[10px] py-2 px-4 rounded hover:bg-red-600 flex-1 text-center leading-tight"
            >
              Batalkan
              <br />
              pesanan
            </button>
            <button
              onClick={editOrder}
              className="bg-agro-green text-white text-[10px] py-2 px-4 rounded hover:bg-green-800 flex-1 text-center leading-tight"
            >
              Edit
              <br />
              pesanan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-l-[3rem] p-6 w-full md:w-1/3 flex flex-col items-center justify-center shadow-[-10px_0_20px_rgba(0,0,0,0.05)] relative md:-ml-4">
          <h3 className="text-gray-500 text-sm mb-6">Metode pembayaran</h3>
          <div className="space-y-4 w-full px-8">
            <button
              onClick={() => selectPayment("gopay")}
              className={`w-full border rounded-xl p-2 flex flex-col items-center hover:bg-blue-50 transition ${
                selectedPayment === "gopay"
                  ? "border-agro-green bg-agro-light"
                  : "border-gray-300"
              }`}
            >
              <span className="font-bold text-blue-600">GOPAY</span>
            </button>
            <button
              onClick={() => selectPayment("dana")}
              className={`w-full border rounded-xl p-2 flex flex-col items-center hover:bg-blue-50 transition ${
                selectedPayment === "dana"
                  ? "border-agro-green bg-agro-light"
                  : "border-gray-300"
              }`}
            >
              <span className="font-bold text-blue-400">DANA</span>
            </button>
            <button
              onClick={() => selectPayment("whatsapp")}
              className={`w-full border rounded-xl p-2 flex flex-col items-center hover:bg-green-50 transition ${
                selectedPayment === "whatsapp"
                  ? "border-agro-green bg-agro-light"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <i className="fa-brands fa-whatsapp text-2xl"></i> WhatsApp
              </div>
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Pilih metode pembayaran</p>
            <p className="text-sm font-bold text-agro-green mt-2">
              {selectedPayment === "gopay"
                ? "GOPAY"
                : selectedPayment === "dana"
                ? "DANA"
                : "WhatsApp"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Payment;
