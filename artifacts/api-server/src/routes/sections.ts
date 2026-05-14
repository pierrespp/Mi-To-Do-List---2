import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, workspacesTable, sectionsTable } from "@workspace/db";
import {
  ListSectionsParams,
  ListSectionsResponse,
  CreateSectionParams,
  CreateSectionBody,
  UpdateSectionParams,
  UpdateSectionBody,
  UpdateSectionResponse,
  DeleteSectionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/workspaces/:slug/sections", async (req, res): Promise<void> => {
  const params = ListSectionsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const sections = await db.select().from(sectionsTable)
    .where(eq(sectionsTable.workspaceId, workspace.id))
    .orderBy(sectionsTable.position);
  res.json(ListSectionsResponse.parse(sections));
});

router.post("/workspaces/:slug/sections", async (req, res): Promise<void> => {
  const params = CreateSectionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateSectionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [workspace] = await db.select().from(workspacesTable).where(eq(workspacesTable.slug, params.data.slug));
  if (!workspace) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }
  const existing = await db.select().from(sectionsTable).where(eq(sectionsTable.workspaceId, workspace.id));
  const position = body.data.position ?? existing.length;
  const [section] = await db.insert(sectionsTable).values({
    workspaceId: workspace.id,
    name: body.data.name,
    emoji: body.data.emoji,
    position,
  }).returning();
  res.status(201).json(section);
});

router.patch("/workspaces/:slug/sections/:sectionId", async (req, res): Promise<void> => {
  const params = UpdateSectionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateSectionBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const updates: Partial<{ name: string; emoji: string; position: number }> = {};
  if (body.data.name !== undefined) updates.name = body.data.name;
  if (body.data.emoji !== undefined) updates.emoji = body.data.emoji;
  if (body.data.position !== undefined) updates.position = body.data.position;
  const [section] = await db.update(sectionsTable).set(updates).where(eq(sectionsTable.id, params.data.sectionId)).returning();
  if (!section) {
    res.status(404).json({ error: "Section not found" });
    return;
  }
  res.json(UpdateSectionResponse.parse(section));
});

router.delete("/workspaces/:slug/sections/:sectionId", async (req, res): Promise<void> => {
  const params = DeleteSectionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(sectionsTable).where(eq(sectionsTable.id, params.data.sectionId));
  res.sendStatus(204);
});

export default router;
