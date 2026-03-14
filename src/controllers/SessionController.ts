import { prisma } from "../prisma";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';
import { authConfig } from "../config/auth";
import { generateRefreshToken } from "../utils/generateRefreshToken";

export class SessionController {
  static async create(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const options: SignOptions = {
      subject: user.id,
      expiresIn: '1d',
    }

    const accessToken = sign(
      {},
      authConfig.jwt.secret,
      options
    )

    const refreshToken = await generateRefreshToken(user.id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return res.json({
      user,
      token: accessToken
    })
  }
}