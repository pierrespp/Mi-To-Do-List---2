import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, workspacesTable, tasksTable } from "@workspace/db";
import {
  ListTasksParams,
  ListTasksResponse,
  CreateTaskParams,
  CreateTaskBody,
  UpdateTaskParams,
  UpdateTaskBody,
  UpdateTaskResponse,
  DeleteTaskParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/workspaces/:slug/tasks", async (req, res): Promise<void> => {
  const params = ListTasksParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const tasks = await db.select().from(tasksTable)
    .where(eq(tasksTable.workspaceId, workspace.id))
    .orderBy(tasksTable.createdAt);
  res.json(ListTasksResponse.parse(tasks));
});

router.post("/workspaces/:slug/tasks", async (req, res): Promise<void> => {
  const params = CreateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateTaskBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const [task] = await db.insert(tasksTable).values({
    workspaceId: workspace.id,
    title: body.data.title,
    sectionId: body.data.sectionId ?? null,
    priority: body.data.priority ?? "medium",
    pinned: body.data.pinned ?? false,
    recurring: body.data.recurring ?? false,
  }).returning();
  res.status(201).json(task);
});

router.patch("/workspaces/:slug/tasks/:taskId", async (req, res): Promise<void> => {
  const params = UpdateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateTaskBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (body.data.title !== undefined) updates.title = body.data.title;
  if (body.data.completed !== undefined) updates.completed = body.data.completed;
  if (body.data.sectionId !== undefined) updates.sectionId = body.data.sectionId;
  if (body.data.priority !== undefined) updates.priority = body.data.priority;
  if (body.data.pinned !== undefined) updates.pinned = body.data.pinned;
  if (body.data.recurring !== undefined) updates.recurring = body.data.recurring;
  if (body.data.archived !== undefined) updates.archived = body.data.archived;
  const [task] = await db.update(tasksTable).set(updates).where(eq(tasksTable.id, params.data.taskId)).returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(UpdateTaskResponse.parse(task));
});

router.delete("/workspaces/:slug/tasks/:taskId", async (req, res): Promise<void> => {
  const params = DeleteTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(tasksTable).where(eq(tasksTable.id, params.data.taskId));
  res.sendStatus(204);
});

export default router;
