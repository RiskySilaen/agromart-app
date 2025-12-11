import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/database";
// 1. IMPORT MODAL YANG SUDAH ANDA BUAT
import ConfirmationModal from "../common/ConfirmationModal"; 

function AdminDashboard({ showNotification }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("add");
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  
  // 2. STATE UNTUK MENGATUR MODAL (BUKA/TUTUP)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "buah",
    stock: "",
    image: "", 
  });

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/");
      return;
    }
    setUser(currentUser);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await db.getProducts();
    setProducts(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    showNotification("Mengupload gambar...", "info");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "agromart_preset"); 
    data.append("cloud_name", "dfewl6y52");          

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfewl6y52/image/upload", 
        { method: "POST", body: data }
      );
      const uploadedImage = await res.json();
      
      if (uploadedImage.secure_url) {
        setFormData({ ...formData, image: uploadedImage.secure_url });
        showNotification("Gambar berhasil diupload!");
      } else {
        throw new Error("Gagal upload");
      }
    } catch (error) {
      showNotification("Gagal upload gambar", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    
    showNotification("Sedang menyimpan...", "info");
    const result = await db.addProduct(formData);

    if (result.success) {
      showNotification("Produk berhasil ditambahkan!");
      setFormData({ name: "", price: "", category: "buah", stock: "", image: "" });
      const fileInput = document.getElementById("fileInput");
      if(fileInput) fileInput.value = "";
      loadProducts();
    } else {
      showNotification("Gagal: " + result.message, "error");
    }
  };

  // 3. FUNGSI BARU: BUKA MODAL SAAT KLIK HAPUS
  // (Menggantikan window.confirm)
  const handleDeleteClick = (product) => {
    setProductToDelete(product); // Simpan dulu produk mana yang mau dihapus
    setIsModalOpen(true);        // Tampilkan modal
  };

  // 4. FUNGSI BARU: EKSEKUSI HAPUS (DIPANGGIL OLEH MODAL)
  const executeDelete = async () => {
    if (!productToDelete) return;

    const result = await db.deleteProduct(productToDelete.id);
    if (result.success) {
      showNotification("Produk berhasil dihapus");
      loadProducts();
    } else {
      showNotification("Gagal menghapus", "error");
    }
    // Tutup modal & bersihkan data
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <section className="container mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-agro-green">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-serif text-3xl text-gray-800">Dashboard Admin</h1>
            <p className="text-sm text-gray-500">Halo, {user?.name}</p>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-red-500 hover:underline">
            Keluar Dashboard
          </button>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-4 mb-8 border-b">
          <button 
            onClick={() => setActiveTab("add")}
            className={`pb-2 px-4 transition ${activeTab === 'add' ? 'border-b-2 border-agro-green font-bold text-agro-green' : 'text-gray-500 hover:text-agro-green'}`}
          >
            + Tambah Produk
          </button>
          <button 
            onClick={() => { setActiveTab("list"); loadProducts(); }}
            className={`pb-2 px-4 transition ${activeTab === 'list' ? 'border-b-2 border-agro-green font-bold text-agro-green' : 'text-gray-500 hover:text-agro-green'}`}
          >
            Daftar Produk
          </button>
        </div>

        {/* FORM TAMBAH */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200 animate-fade-in-up">
            {/* ... Form input sama seperti sebelumnya ... */}
            <h2 className="font-bold text-xl mb-4 text-gray-700">Input Data Sayur/Buah</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama Produk</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kategori</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none bg-white">
                    <option value="buah">Buah</option>
                    <option value="sayur">Sayur</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Harga (Rp)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stok Awal</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 rounded border focus:ring-2 focus:ring-agro-green outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload Foto</label>
                <input id="fileInput" type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-agro-green hover:file:bg-green-100" />
                {uploading && <p className="text-xs text-blue-500 mt-1">Sedang mengupload...</p>}
              </div>
              {formData.image && <img src={formData.image} alt="Preview" className="h-32 object-contain rounded-lg border bg-white mt-2" />}
              <button type="submit" disabled={uploading} className={`w-full text-white font-bold py-3 rounded-lg shadow-md transition mt-4 ${uploading ? 'bg-gray-400' : 'bg-agro-green hover:bg-green-700'}`}>
                {uploading ? "Tunggu..." : "Simpan Produk"}
              </button>
            </form>
          </div>
        )}

        {/* DAFTAR PRODUK */}
        {activeTab === "list" && (
          <div className="overflow-x-auto animate-fade-in-up">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50 text-gray-700 border-b border-green-200">
                  <th className="p-4 font-semibold">Foto</th>
                  <th className="p-4 font-semibold">Nama</th>
                  <th className="p-4 font-semibold">Kategori</th>
                  <th className="p-4 font-semibold">Harga</th>
                  <th className="p-4 font-semibold">Stok</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">Belum ada produk.</td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                        )}
                      </td>
                      <td className="p-3 font-medium">{item.name}</td>
                      <td className="p-3 capitalize text-sm text-gray-600">{item.category}</td>
                      <td className="p-3 text-sm">Rp {item.price.toLocaleString("id-ID")}</td>
                      <td className="p-3 text-sm">{item.stock}</td>
                      <td className="p-3 text-center">
                        {/* 5. GANTI ONCLICK DI SINI */}
                        <button 
                          onClick={() => handleDeleteClick(item)} // Panggil fungsi buka modal
                          className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm font-bold transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. PASANG KOMPONEN MODAL DI SINI (INVISIBLE SAMPAI ISOPEN=TRUE) */}
        <ConfirmationModal 
          isOpen={isModalOpen}
          title="Hapus Produk?"
          message={`Apakah Anda yakin ingin menghapus "${productToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onConfirm={executeDelete}
          onCancel={() => setIsModalOpen(false)}
        />

      </div>
    </section>
  );
}

export default AdminDashboard;