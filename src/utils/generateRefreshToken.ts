import { prisma } from "@/prisma"
import { addDays } from "date-fns"
import { v4 as uuid } from 'uuid'

export async function generateRefreshToken(userId: string) {
  const refreshToken = uuid()

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: addDays(new Date(), 7)
    }
  })

  return refreshToken
}