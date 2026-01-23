import { prisma } from "@/prisma";

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  await prisma.refreshToken.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(() => {
  prisma.$disconnect
})