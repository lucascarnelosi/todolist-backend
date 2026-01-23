import { Router } from "express";
import { HealthController } from "@/controllers/HealthController";
import userRoutes from "./user.routes";
import sessionRoutes from "./session.routes";
import taskRoutes from "./task.routes";
import { RefreshTokenController } from "@/controllers/RefreshTokenController";
import { LogoutController } from "@/controllers/LogoutController";

const routes = Router();

routes.get('/health', HealthController.check)
routes.post('/refresh-token', RefreshTokenController.refresh)
routes.post('/logout', LogoutController.logout)

routes.use(userRoutes)
routes.use(sessionRoutes);
routes.use(taskRoutes)

export default routes;