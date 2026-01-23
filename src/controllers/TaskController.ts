import { prisma } from "@/prisma";
import { Request, Response } from "express";

export class TaskController {
  static async create(req: Request, res: Response) {
    const { title } = req.body
    const userId = req.user.id

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
      })
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId,
      }
    })

    return res.status(201).json(task)
  }

  static async list(req: Request, res: Response) {
    const userId = req.user.id

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return res.json(tasks)
  }

  static async toggleCompleted(req: Request, res: Response) {
    const { id } = req.params
    const userId = req.user.id

    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        message: 'You do not have permission to modify this task'
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed
      }
    })

    return res.json(updatedTask)
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params
    const { title } = req.body
    const userId = req.user.id

    if (!title) {
      return res.status(400).json({
        message: 'Title is required'
      })
    }

    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        message: 'You do not have permission to edit this task'
      })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title
      }
    })

    return res.json(updatedTask)
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params
    const userId = req.user.id

    const task = await prisma.task.findUnique({
      where: { id }
    })

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    if (task.userId !== userId) {
      return res.status(403).json({
        message: 'You do not have permission to delete this task'
      })
    }

    await prisma.task.delete({
      where: { id },
    })

    return res.status(204).send()
  }
}