import { Router } from 'express'
import { TaskController } from '../controllers/TaskController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const taskRoutes = Router()

taskRoutes.use(ensureAuthenticated)

taskRoutes.get('/tasks', TaskController.list)
taskRoutes.post('/tasks', TaskController.create)
taskRoutes.patch('/tasks/:id/toggle', TaskController.toggleCompleted)
taskRoutes.patch('/tasks/:id', TaskController.update)
taskRoutes.delete('/tasks/:id', TaskController.delete)

export default taskRoutes