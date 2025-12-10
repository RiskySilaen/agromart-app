import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";

function AdminDashboard({ showNotification }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("add");
  const [uploading, setUploading] = useState(false); // State untuk loading upload
  
  // State untuk Form Produk
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "buah",
    stock: "",
    image: "", 
  });

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    // Cek keamanan: hanya admin yang boleh masuk
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/");
      return;
    }
    setUser(currentUser);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- FUNGSI UPLOAD KE CLOUDINARY ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    showNotification("Mengupload gambar...", "info");

    const data = new FormData();
    data.append("file", file);
    
    // --- GANTI DUA BARIS INI DENGAN DATA CLOUDINARY ANDA ---
    data.append("upload_preset", "agromart_preset"); // Ganti dengan nama upload preset Anda
    data.append("cloud_name", "dfewl6y52");      // Ganti dengan Cloud Name Anda
    // -------------------------------------------------------

    try {
      // --- GANTI JUGA 'dxyz12345' DI URL INI DENGAN CLOUD NAME ANDA ---
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfewl6y52/image/upload", 
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();
      
      if (uploadedImage.secure_url) {
        setFormData({ ...formData, image: uploadedImage.secure_url });
        showNotification("Gambar berhasil diupload!");
      } else {
        console.error("Upload failed:", uploadedImage);
        throw new Error("Gagal mendapatkan URL gambar");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("Gagal upload gambar. Cek koneksi atau setting Cloudinary.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) {
        showNotification("Tunggu upload gambar selesai", "warning");
        return;
    }
    
    showNotification("Sedang menyimpan...", "info");
    
    // Kirim data ke database (lewat service database.js)
    const result = await db.addProduct(formData);

    if (result.success) {
      showNotification("Produk berhasil ditambahkan!");
      // Reset form setelah sukses
      setFormData({
        name: "",
        price: "",
        category: "buah",
        stock: "",
        image: "",
      });
      // Reset input file secara manual
      const fileInput = document.getElementById("fileInput");
      if(fileInput) fileInput.value = "";
    } else {
      showNotification("Gagal: " + result.message, "error");
    }
  };

  return (
    <section className="container mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-agro-green">
        
        {/* HEADER DASHBOARD */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-serif text-3xl text-gray-800">Dashboard Admin</h1>
            <p className="text-sm text-gray-500">Halo, {user?.name}</p>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-red-500 hover:underline">
            Keluar Dashboard
          </button>
        </div>

        {/* TAB MENU (Bisa dikembangkan nanti untuk fitur Edit/Delete) */}
        <div className="flex gap-4 mb-8 border-b">
          <button 
            onClick={() => setActiveTab("add")}
            className={`pb-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-agro-green font-bold text-agro-green' : 'text-gray-500'}`}
          >
            + Tambah Produk
          </button>
        </div>

        {/* FORM TAMBAH PRODUK */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="font-bold text-xl mb-4 text-gray-700">Input Data Sayur/Buah</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Baris 1: Nama & Kategori */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama Produk</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none"
                    placeholder="Contoh: Apel Fuji"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none bg-white"
                  >
                    <option value="buah">Buah</option>
                    <option value="sayur">Sayur</option>
                  </select>
                </div>
              </div>

              {/* Baris 2: Harga & Stok */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none"
                    placeholder="15000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              {/* Baris 3: Upload Foto */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload Foto Produk</label>
                <div className="flex flex-col gap-2">
                    <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-agro-green
                        hover:file:bg-green-100
                    "
                    />
                    {/* Input URL manual sebagai cadangan (hidden/opsional) */}
                    <input 
                        type="hidden" 
                        name="image" 
                        value={formData.image} 
                    />
                </div>
                {uploading && <p className="text-xs text-blue-500 mt-1 animate-pulse">Sedang mengupload ke Cloudinary...</p>}
              </div>

              {/* Preview Gambar */}
              {formData.image && (
                <div className="mt-2 flex flex-col items-center p-2 border border-dashed rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-400 mb-1">Preview Gambar:</p>
                  <img src={formData.image} alt="Preview" className="h-32 object-contain rounded-lg bg-white shadow-sm" />
                </div>
              )}

              {/* Tombol Simpan */}
              <button
                type="submit"
                disabled={uploading}
                className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition mt-4 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-agro-green hover:bg-green-700'}`}
              >
                {uploading ? "Tunggu Upload..." : "Simpan Produk"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;