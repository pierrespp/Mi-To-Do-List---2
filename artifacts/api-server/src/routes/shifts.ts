import { Router, type IRouter } from "express";
import { eq, and, isNull } from "drizzle-orm";
import { db, workspacesTable, tasksTable, shiftsTable } from "@workspace/db";
import {
  ListShiftsParams,
  ListShiftsResponse,
  RestartShiftParams,
  RestartShiftResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/workspaces/:slug/shifts", async (req, res): Promise<void> => {
  const params = ListShiftsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const shifts = await db.select().from(shiftsTable)
    .where(eq(shiftsTable.workspaceId, workspace.id))
    .orderBy(shiftsTable.startedAt);
  res.json(ListShiftsResponse.parse(shifts));
});

router.post("/workspaces/:slug/shifts/restart", async (req, res): Promise<void> => {
  const params = RestartShiftParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }

  // Close the current open shift
  const now = new Date();
  await db.update(shiftsTable)
    .set({ endedAt: now })
    .where(and(eq(shiftsTable.workspaceId, workspace.id), isNull(shiftsTable.endedAt)));

  // Archive all non-archived tasks
  await db.update(tasksTable)
    .set({ archived: true, completed: false })
    .where(and(eq(tasksTable.workspaceId, workspace.id), eq(tasksTable.archived, false)));

  // Create new shift
  const [newShift] = await db.insert(shiftsTable).values({ workspaceId: workspace.id }).returning();

  // Spawn recurring tasks into the new shift
  const recurringTasks = await db.select().from(tasksTable).where(
    and(eq(tasksTable.workspaceId, workspace.id), eq(tasksTable.recurring, true))
  );

  if (recurringTasks.length > 0) {
    await db.insert(tasksTable).values(
      recurringTasks.map(t => ({
        workspaceId: workspace.id,
        sectionId: t.sectionId,
        shiftId: newShift.id,
        title: t.title,
        priority: t.priority,
        pinned: t.pinned,
        recurring: true,
      }))
    );
  }

  res.json(RestartShiftResponse.parse(newShift));
});

export default router;
