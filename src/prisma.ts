import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import pkg from '@prisma/client';

const { PrismaClient } = pkg

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db"
}, {
  timestampFormat: 'unixepoch-ms'
})

export const prisma = new PrismaClient({ adapter });