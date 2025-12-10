import prisma from './prisma.js';

export default async function handler(req, res) {
  // 1. GET: Ambil Semua Data
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        orderBy: { id: 'desc' }
      });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
  }

  // 2. POST: Tambah Data Baru
  if (req.method === 'POST') {
    try {
      const { name, price, category, stock, image } = req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          category,
          stock: parseInt(stock),
          rating: 4.5,
          image: image || "",
        },
      });

      return res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Gagal menambah produk' });
    }
  }

  // 3. DELETE: Hapus Data (BARU)
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body; // Ambil ID dari data yang dikirim
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID produk diperlukan' });
      }

      await prisma.product.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ success: true, message: 'Produk dihapus' });
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ success: false, message: 'Gagal menghapus produk' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}