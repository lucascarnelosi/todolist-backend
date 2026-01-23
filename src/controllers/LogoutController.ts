import { Request, Response } from "express";
import { prisma } from "@/prisma";

export class LogoutController {
  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken

    res.clearCookie('refreshToken', {
      path: '/'
    })

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })

    return res.status(204).send()
  }
}