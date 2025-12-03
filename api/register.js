import prisma from './prisma.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, password } = req.body;
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
      }

      // Buat user baru
      const user = await prisma.user.create({
        data: { name, email, phone, password },
      });
      
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Gagal mendaftar' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}