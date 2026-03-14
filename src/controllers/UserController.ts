import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcrypt'

export class UserController {
  static async create(req: Request, res: Response) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Missing required fields',
      })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      })

      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(409).json({
          message: 'Email already in use',
        })
      }

      console.log(error);

      return res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async me(req: Request, res: Response) {
    const userId = req.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return res.json(user)
  }
}