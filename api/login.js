import prisma from './prisma.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user && user.password === password) {
        return res.status(200).json({ success: true, user });
      }

      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}