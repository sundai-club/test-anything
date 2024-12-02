import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // You can add seed data here if needed
  console.log('Database seeded...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 