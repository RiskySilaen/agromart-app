// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = [
    { name: "Banana", price:  15000, rating: 4.5, category: "buah", stock: 50 },
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

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
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