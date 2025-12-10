import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. IMPORT GAMBAR (Pastikan banana.jpg sudah di-rename)
import bananaImg from "../../assets/buah_banana.jpg";
import apelImg from "../../assets/apel.jpg";
import tomatImg from "../../assets/tomat.jpg";
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
  "Banana":buah_bananaImg, // <-- Kunci "Banana" sesuai database
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

function Order({ showNotification, db }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allProducts = await db.getProducts();
    const cartItems = db.getCart();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    setCart(cartItems);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 0) newQuantity = 0;
    db.updateCartItem(productId, newQuantity);
    showNotification("Keranjang diperbarui");
    loadData();
  };

  const removeCartItem = (productId) => {
    db.removeFromCart(productId);
    showNotification("Produk dihapus dari keranjang");
    loadData();
  };

  const searchOrderProducts = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      showNotification("Keranjang belanja kosong", "error");
      return;
    }
    navigate("/payment");
  };

  return (
    <section className="container mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* SIDEBAR KERANJANG */}
      <div className="w-full md:w-1/3 bg-agro-green rounded-3xl p-6 text-white shadow-xl flex flex-col h-[600px]">
        <h2 className="font-serif text-xl text-center mb-6">Pesanan anda</h2>

        <div className="bg-white rounded-2xl flex-grow text-gray-800 p-4 custom-scroll overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <i className="fas fa-shopping-cart text-3xl mb-2"></i>
              <p>Keranjang belanja kosong</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 border-b border-gray-100 pb-2"
              >
                <span className="text-xs text-gray-500 w-4">{index + 1}.</span>
                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                   <img 
                    // Gunakan productImages untuk menampilkan gambar di keranjang
                    src={productImages[item.name] || logoAgromart} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-bold">{item.name}</div>
                  <div className="text-[10px] text-yellow-500">
                    <i className="fa-solid fa-star"></i> {item.rating}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="text-sm font-bold">x {item.quantity}</div>
                <button
                  onClick={() => removeCartItem(item.productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center bg-white/20 rounded-lg px-4 py-2 mb-4">
            <span className="text-sm font-bold">TOTAL :</span>
            <span className="text-sm font-bold">
              Rp {getCartTotal().toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-agro-card-green hover:bg-green-700 text-white font-bold py-2 rounded-full shadow-lg text-sm"
          >
            Bayar
          </button>
        </div>
      </div>

      {/* GRID DAFTAR PRODUK */}
      <div className="w-full md:w-2/3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => searchOrderProducts(e.target.value)}
          placeholder="Cari produk..."
          className="w-full max-w-sm pl-4 pr-10 py-2 rounded-xl border-none shadow-sm mb-6 focus:ring-2 focus:ring-agro-green bg-white"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <p>Produk tidak ditemukan</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const cartItem = cart.find(
                (item) => item.productId === product.id
              );
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-xl shadow-soft text-center flex flex-col items-center"
                >
                  <div className="h-24 w-full mb-2 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={productImages[product.name] || logoAgromart} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-yellow-400 text-xs mb-1">
                    <i className="fa-solid fa-star"></i> {product.rating}
                  </div>
                  <h3 className="font-bold text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Rp {product.price.toLocaleString("id-ID")} / pack
                  </p>
                  <div className="flex items-center justify-center gap-3 bg-gray-200 rounded-full px-2 py-1">
                    <button
                      onClick={() =>
                        updateCartQuantity(product.id, quantity - 1)
                      }
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="text-xs font-bold w-4">{quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(product.id, quantity + 1)
                      }
                      className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shadow-sm"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Order;