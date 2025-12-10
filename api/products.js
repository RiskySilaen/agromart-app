// api/products.js
import prisma from './prisma.js';

export default async function handler(req, res) {
  // 1. JIKA METODE GET (Ambil Data)
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        orderBy: { id: 'desc' } // Urutkan dari yang terbaru
      });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
  }

  // 2. JIKA METODE POST (Tambah Data)
  if (req.method === 'POST') {
    try {
      const { name, price, category, stock, image } = req.body;

      // Validasi sederhana
      if (!name || !price || !category) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price), // Pastikan jadi angka
          category,
          stock: parseInt(stock),   // Pastikan jadi angka
          rating: 4.5,              // Default rating
          image: image || "",       // Simpan URL gambar
        },
      });

      return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      console.error("Error create product:", error);
      return res.status(500).json({ success: false, message: 'Gagal menambah produk' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}