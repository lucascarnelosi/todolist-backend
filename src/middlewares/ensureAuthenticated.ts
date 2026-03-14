import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth'

interface TokenPayload {
  sub: string
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token missing',
    })
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload

    req.user = {
      id: decoded.sub,
    }

    return next();
  } catch {
    return res.status(401).json({
      message: 'Invalid token',
    })
  }
}