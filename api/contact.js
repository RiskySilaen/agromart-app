// api/contact.js
import prisma from './prisma.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message } = req.body;
    
    // Validasi data
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    try {
      // Simpan ke tabel Contact di database
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || "", // Phone opsional
          message,
        },
      });
      
      return res.status(200).json({ success: true, data: newContact });
    } catch (error) {
      console.error("Contact API Error:", error);
      return res.status(500).json({ success: false, message: 'Gagal mengirim pesan' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}