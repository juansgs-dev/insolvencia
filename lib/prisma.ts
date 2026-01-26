import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn']
})

async function main() {
  const todos = await prisma.role.findMany({
      select: { id: true }
  });
  console.log('Emails en la BD:', todos);
}

main();

export { prisma }