import React, { useState, useEffect } from "react";
// Import Logo & Gambar Produk
import logoAgromart from "../../assets/logo_agromart.png";
import bananaImg from "../../assets/banana.jpg";
import apelImg from "../../assets/apel.jpg";
import tomatImg from "../../assets/tomat.jpg";
import semangkaImg from "../../assets/semangka.jpg";
import wortelImg from "../../assets/wortel.jpg";
import nanasImg from "../../assets/nanas.jpg"; // Sudah ada gambarnya sekarang
import cabeMerahImg from "../../assets/cabe_merah.jpg";
import cabeHijauImg from "../../assets/cabe_hijau.jpg";
import anggurImg from "../../assets/anggur.jpg";
import jerukImg from "../../assets/jeruk.jpg";
import buncisImg from "../../assets/buncis.jpg";

// Mapping Nama Produk ke File Gambar
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

function Product({ showNotification, db }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const allProducts = await db.getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  };

  const searchProducts = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        db.addToCartWithDetails(product, 1); 
        showNotification("Produk ditambahkan ke keranjang");
    }
  };

  return (
    <section className="container mx-auto p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-agro-green overflow-hidden bg-white shrink-0 flex items-center justify-center">
          <img 
            src={logoAgromart} 
            alt="Logo Agromart" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-grow">
          <h2 className="font-serif text-2xl text-gray-800 mb-1">PRODUK</h2>
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => searchProducts(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-4 pr-10 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-agro-green bg-white"
            />
            <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-4 text-center py-8 text-gray-500">
              <p>Produk tidak ditemukan</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-3 rounded-2xl shadow-soft flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
              >
                <div className="h-28 w-full mb-2 bg-white rounded-xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={productImages[product.name] || logoAgromart} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="w-full text-left px-1">
                  <div className="text-yellow-400 text-xs">
                    <i className="fa-solid fa-star"></i> {product.rating}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full mt-2 bg-agro-green text-white py-1 rounded-lg text-xs hover:bg-green-700"
                  >
                    <i className="fas fa-cart-plus mr-1"></i> Tambah
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gradient-to-b from-agro-green to-green-400 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[400px]">
          <div className="relative z-10 mb-8">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
              Promo bulan ini
            </span>
            <h3 className="font-serif text-2xl font-bold mb-2 leading-tight">
              Gratis 1 kg apel
            </h3>
            <p className="text-xs opacity-90 leading-relaxed max-w-[70%]">
              dapatkan promo ini dengan membeli 6 produk bebas, minimal 1/2 kg
              per produk
            </p>
          </div>

          <div className="border-t border-white/30 my-2"></div>

          <div className="relative z-10 flex justify-between items-end">
            <div>
              <h3 className="font-serif text-xl font-bold mb-2">
                Diskon sampai 30%
              </h3>
              <p className="text-xs opacity-90 max-w-[70%]">
                dapatkan promo ini, hanya dengan total belanjaan Rp. 250.000,00
              </p>
            </div>
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-lg transform rotate-12 shrink-0">
              <div className="text-center leading-none">
                <span className="text-lg font-bold">30%</span>
                <br />
                <span className="text-[8px]">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Product;