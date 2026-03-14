import { Router } from "express";
import { SessionController } from "../controllers/SessionController.ts";

const sessionRoutes = Router();

sessionRoutes.post('/sessions', SessionController.create);

export default sessionRoutes