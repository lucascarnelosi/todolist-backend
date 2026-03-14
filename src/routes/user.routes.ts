import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.ts";

const userRoutes = Router();

userRoutes.post('/users', UserController.create);
userRoutes.get('/users/me', ensureAuthenticated, UserController.me)

export default userRoutes;