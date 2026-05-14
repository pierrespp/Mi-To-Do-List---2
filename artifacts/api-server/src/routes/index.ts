import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workspacesRouter from "./workspaces";
import sectionsRouter from "./sections";
import tasksRouter from "./tasks";
import shiftsRouter from "./shifts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workspacesRouter);
router.use(sectionsRouter);
router.use(tasksRouter);
router.use(shiftsRouter);

export default router;
