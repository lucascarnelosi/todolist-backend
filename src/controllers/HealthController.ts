import { Request, Response } from "express";

export class HealthController {
  static check(req: Request, res: Response) {
    return res.json({ status: 'ok' })
  }
}