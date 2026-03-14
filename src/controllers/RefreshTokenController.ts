import { Request, Response } from "express"
import { sign } from "jsonwebtoken"
import { prisma } from "../prisma.ts"
import { authConfig } from "../config/auth.ts"

export class RefreshTokenController {
  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken

    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!token) {
      return res.status(401).json({
        message: 'Invalid refresh token'
      })
    }

    if (new Date() > token.expiresAt) {
      await prisma.refreshToken.delete({
        where: { id: token.id }
      })

      return res.status(401).json({
        message: 'Refresh token expired'
      })
    }

    const newAccessToken = sign(
      {},
      authConfig.jwt.secret,
      {
        subject: token.userId,
        expiresIn: '1d'
      }
    )

    return res.json({
      token: newAccessToken
    })
  }
}