import prisma from './prisma.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Gagal mengambil data' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}