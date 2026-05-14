import { Router, type IRouter } from "express";
import { eq, and, count } from "drizzle-orm";
import { db, workspacesTable, sectionsTable, tasksTable, shiftsTable } from "@workspace/db";
import {
  CreateWorkspaceBody,
  GetWorkspaceParams,
  DeleteWorkspaceParams,
  ListWorkspacesResponse,
  GetWorkspaceResponse,
  GetWorkspaceStatsParams,
  GetWorkspaceStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/workspaces", async (req, res): Promise<void> => {
  const workspaces = await db.select().from(workspacesTable).orderBy(workspacesTable.createdAt);
  res.json(ListWorkspacesResponse.parse(workspaces));
});

router.post("/workspaces", async (req, res): Promise<void> => {
  const parsed = CreateWorkspaceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [workspace] = await db.insert(workspacesTable).values(parsed.data).returning();
  // Create default sections
  await db.insert(sectionsTable).values([
    { workspaceId: workspace.id, name: "Tarefas do Dia", emoji: "💖", position: 0 },
    { workspaceId: workspace.id, name: "Importantes", emoji: "⭐", position: 1 },
    { workspaceId: workspace.id, name: "Fechamento", emoji: "🌙", position: 2 },
  ]);
  // Create initial shift
  await db.insert(shiftsTable).values({ workspaceId: workspace.id });
  res.status(201).json(GetWorkspaceResponse.parse(workspace));
});

router.get("/workspaces/:slug", async (req, res): Promise<void> => {
  const params = GetWorkspaceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  res.json(GetWorkspaceResponse.parse(workspace));
});

router.delete("/workspaces/:slug", async (req, res): Promise<void> => {
  const params = DeleteWorkspaceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  res.sendStatus(204);
});

router.get("/workspaces/:slug/stats", async (req, res): Promise<void> => {
  const params = GetWorkspaceStatsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const allTasks = await db.select().from(tasksTable).where(
    and(eq(tasksTable.workspaceId, workspace.id), eq(tasksTable.archived, false))
  );
  const stats = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.completed).length,
    pending: allTasks.filter(t => !t.completed).length,
    pinned: allTasks.filter(t => t.pinned).length,
    recurring: allTasks.filter(t => t.recurring).length,
  };
  res.json(GetWorkspaceStatsResponse.parse(stats));
});

export default router;
