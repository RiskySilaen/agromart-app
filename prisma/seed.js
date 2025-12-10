// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // --- 1. SEED PRODUK ---
  const products = [
    { name: "Banana", price: 15000, rating: 4.5, category: "buah", stock: 50 },
    { name: "Apel", price: 25000, rating: 4.7, category: "buah", stock: 30 },
    { name: "Tomat", price: 20000, rating: 4.8, category: "sayur", stock: 40 },
    { name: "Semangka", price: 18000, rating: 4.8, category: "buah", stock: 20 },
    { name: "Wortel", price: 23000, rating: 4.6, category: "sayur", stock: 35 },
    { name: "Nanas", price: 22000, rating: 4.5, category: "buah", stock: 25 },
    { name: "Cabe Merah", price: 28000, rating: 4.9, category: "sayur", stock: 45 },
    { name: "Cabe Hijau", price: 27000, rating: 4.9, category: "sayur", stock: 40 },
    { name: "Anggur", price: 65000, rating: 4.8, category: "buah", stock: 15 },
    { name: "Jeruk", price: 40000, rating: 4.8, category: "buah", stock: 30 },
    { name: "Buncis", price: 15000, rating: 4.7, category: "sayur", stock: 25 },
  ]

  console.log('Mulai seeding produk...')
  
  // Hapus semua produk lama dulu agar tidak duplikat (opsional, tapi disarankan saat development)
  // await prisma.product.deleteMany({}) 

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log('Produk berhasil ditambahkan.')

  // --- 2. SEED ADMIN (BARU) ---
  console.log('Membuat akun admin...')
  const adminEmail = 'admin@agromart.com';
  
  // Cek apakah admin sudah ada?
  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: "Admin Agromart",
        email: adminEmail,
        phone: "08123456789",
        password: "admin", // Password sederhana untuk admin
        role: "admin"      // Role ini PENTING untuk login admin
      }
    });
    console.log(`SUKSES: Akun Admin dibuat!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Pass : admin`);
  } else {
    console.log('INFO: Akun Admin sudah ada, tidak perlu dibuat ulang.');
  }

  console.log('Seeding selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })