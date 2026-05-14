import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

/* ─── Helpers ────────────────────────────────────────────────── */
const mapWorkspace = (w: any) => ({
  ...w,
  createdAt: w.created_at,
});

const mapSection = (s: any) => ({
  ...s,
  workspaceId: s.workspace_id,
  createdAt: s.created_at,
});

const mapTask = (t: any) => ({
  ...t,
  workspaceId: t.workspace_id,
  sectionId: t.section_id,
  shiftId: t.shift_id,
  createdAt: t.created_at,
});

/* ─── Query Keys ─────────────────────────────────────────────── */
export const getListWorkspacesQueryKey = () => ["workspaces"];
export const getGetWorkspaceQueryKey = (slug: string) => ["workspace", slug];
export const getListSectionsQueryKey = (slug: string) => ["sections", slug];
export const getListTasksQueryKey = (slug: string) => ["tasks", slug];
export const getGetWorkspaceStatsQueryKey = (slug: string) => ["stats", slug];

/* ─── Workspaces ─────────────────────────────────────────────── */
export function useListWorkspaces() {
  return useQuery({
    queryKey: getListWorkspacesQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(mapWorkspace);
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: { name: string; slug: string } }) => {
      const { data: workspace, error } = await supabase
        .from("workspaces")
        .insert(data)
        .select()
        .single();
      if (error) throw error;

      // Create default sections
      const defaultSections = [
        { name: "Tarefas do Dia", emoji: "☀️", position: 0, workspace_id: workspace.id },
        { name: "Importantes", emoji: "⭐", position: 1, workspace_id: workspace.id },
        { name: "Fechamento", emoji: "🌙", position: 2, workspace_id: workspace.id },
      ];
      await supabase.from("sections").insert(defaultSections);

      return mapWorkspace(workspace);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListWorkspacesQueryKey() });
    },
  });
}

export function useGetWorkspace(slug: string, options?: any) {
  return useQuery({
    queryKey: getGetWorkspaceQueryKey(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return mapWorkspace(data);
    },
    ...options?.query,
  });
}

/* ─── Sections ───────────────────────────────────────────────── */
export function useListSections(slug: string, options?: any) {
  return useQuery({
    queryKey: getListSectionsQueryKey(slug),
    queryFn: async () => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) return [];

      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("position", { ascending: true });
      if (error) throw error;
      return data.map(mapSection);
    },
    ...options?.query,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: { name: string; emoji: string } }) => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) throw new Error("Workspace not found");

      const { data: section, error } = await supabase
        .from("sections")
        .insert({ 
          name: data.name,
          emoji: data.emoji,
          workspace_id: workspace.id 
        })
        .select()
        .single();
      if (error) throw error;
      return mapSection(section);
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListSectionsQueryKey(slug) });
    },
  });
}

/* ─── Tasks ─────────────────────────────────────────────────── */
export function useListTasks(slug: string, options?: any) {
  return useQuery({
    queryKey: getListTasksQueryKey(slug),
    queryFn: async () => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("archived", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(mapTask);
    },
    ...options?.query,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: any }) => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) throw new Error("Workspace not found");

      const { data: task, error } = await supabase
        .from("tasks")
        .insert({ 
          title: data.title,
          priority: data.priority,
          pinned: data.pinned,
          recurring: data.recurring,
          section_id: data.sectionId,
          workspace_id: workspace.id,
        })
        .select()
        .single();
      if (error) throw error;
      return mapTask(task);
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, taskId, data }: { slug: string; taskId: number; data: any }) => {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.completed !== undefined) updateData.completed = data.completed;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.pinned !== undefined) updateData.pinned = data.pinned;
      if (data.recurring !== undefined) updateData.recurring = data.recurring;
      if (data.sectionId !== undefined) updateData.section_id = data.sectionId;
      if (data.archived !== undefined) updateData.archived = data.archived;

      const { data: task, error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId)
        .select()
        .single();
      if (error) throw error;
      return mapTask(task);
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, taskId }: { slug: string; taskId: number }) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);
      if (error) throw error;
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
    },
  });
}

/* ─── Stats ─────────────────────────────────────────────────── */
export function useGetWorkspaceStats(slug: string, options?: any) {
  return useQuery({
    queryKey: getGetWorkspaceStatsQueryKey(slug),
    queryFn: async () => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) return { total: 0, completed: 0, pinned: 0 };

      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("completed, pinned")
        .eq("workspace_id", workspace.id)
        .eq("archived", false);
      
      if (error) throw error;

      return {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pinned: tasks.filter(t => t.pinned).length,
      };
    },
    ...options?.query,
  });
}

/* ─── Shift ─────────────────────────────────────────────────── */
export function useRestartShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug }: { slug: string }) => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) throw new Error("Workspace not found");

      // Archive current tasks
      await supabase
        .from("tasks")
        .update({ archived: true })
        .eq("workspace_id", workspace.id)
        .eq("archived", false);

      // Create a new shift record
      const { data: shift } = await supabase
        .from("shifts")
        .insert({ workspace_id: workspace.id })
        .select()
        .single();

      // Respawn recurring tasks
      const { data: recurringTasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("recurring", true)
        .eq("archived", true);
      
      if (recurringTasks && recurringTasks.length > 0) {
        const newTasks = recurringTasks.map(t => ({
          workspace_id: workspace.id,
          section_id: t.section_id,
          shift_id: shift.id,
          title: t.title,
          priority: t.priority,
          pinned: t.pinned,
          recurring: true,
          completed: false,
          archived: false,
        }));
        await supabase.from("tasks").insert(newTasks);
      }

      return { success: true };
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
    },
  });
}
