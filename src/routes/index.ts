import { Router } from "express";
import { HealthController } from "../controllers/HealthController.ts";
import { LogoutController } from "../controllers/LogoutController.ts";
import { RefreshTokenController } from "../controllers/RefreshTokenController.ts";
import userRoutes from "./user.routes.ts";
import sessionRoutes from "./session.routes.ts";
import taskRoutes from "./task.routes.ts";

const routes = Router();

routes.get('/health', HealthController.check)
routes.post('/refresh-token', RefreshTokenController.refresh)
routes.post('/logout', LogoutController.logout)

routes.use(userRoutes)
routes.use(sessionRoutes);
routes.use(taskRoutes)

export default routes;