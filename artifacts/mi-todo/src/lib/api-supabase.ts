import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

/* ─── Interfaces ────────────────────────────────────────────── */
export interface Workspace {
  id: number;
  slug: string;
  name: string;
  createdAt: string;
}

export interface Section {
  id: number;
  workspaceId: number;
  name: string;
  emoji: string;
  position: number;
  createdAt: string;
}

export interface Task {
  id: number;
  workspaceId: number;
  sectionId: number | null;
  shiftId: number | null;
  title: string;
  completed: boolean;
  priority: string;
  pinned: boolean;
  recurring: boolean;
  archived: boolean;
  position: number;
  createdAt: string;
}

export interface WorkspaceStats {
  total: number;
  completed: number;
  pinned: number;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const mapWorkspace = (w: any): Workspace => ({
  ...w,
  createdAt: w.created_at,
});

const mapSection = (s: any): Section => ({
  ...s,
  workspaceId: s.workspace_id,
  createdAt: s.created_at,
});

const mapTask = (t: any): Task => ({
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
  return useQuery<Workspace[]>({
    queryKey: getListWorkspacesQueryKey(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapWorkspace);
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
  return useQuery<Workspace>({
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
  return useQuery<Section[]>({
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
      return (data || []).map(mapSection);
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
  return useQuery<Task[]>({
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
      return (data || []).map(mapTask);
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
  return useQuery<WorkspaceStats>({
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
    mutationFn: async ({ slug, sectionId }: { slug: string; sectionId?: number }) => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) throw new Error("Workspace not found");

      // 1. Arquivar tarefas ativas (escopado por sectionId se fornecido)
      // Exclui tarefas fixadas (pinned === true) que ainda não foram concluídas (completed === false)
      let archiveQuery = supabase
        .from("tasks")
        .update({ archived: true })
        .eq("workspace_id", workspace.id)
        .eq("archived", false)
        .or("pinned.eq.false,completed.eq.true");

      if (sectionId !== undefined) {
        archiveQuery = archiveQuery.eq("section_id", sectionId);
      }
      await archiveQuery;

      // 2. Turno: Se for reset completo (sem sectionId), criar novo turno
      let shiftId: number | null = null;
      if (sectionId === undefined) {
        const { data: shift } = await supabase
          .from("shifts")
          .insert({ workspace_id: workspace.id })
          .select()
          .single();
        shiftId = shift.id;
      } else {
        // Buscar o turno ativo atual do workspace para herança atômica nas recorrentes
        const { data: activeShift } = await supabase
          .from("shifts")
          .select("id")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (activeShift) {
          shiftId = activeShift.id;
        }
      }

      // 3. Buscar e recriar recorrentes com position sequencial limpa escopada
      let recurringQuery = supabase
        .from("tasks")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("recurring", true)
        .eq("archived", true);

      if (sectionId !== undefined) {
        recurringQuery = recurringQuery.eq("section_id", sectionId);
      }
      const { data: recurringTasks } = await recurringQuery;
      
      if (recurringTasks && recurringTasks.length > 0) {
        // Contadores sequenciais indexados por section_id para reindexação limpa de position
        const positionCounters: Record<number, number> = {};

        const newTasks = recurringTasks.map(t => {
          const secId = t.section_id || 0;
          if (positionCounters[secId] === undefined) {
            positionCounters[secId] = 0;
          }
          const currentPos = positionCounters[secId]++;

          return {
            workspace_id: workspace.id,
            section_id: t.section_id,
            shift_id: shiftId,
            title: t.title,
            priority: t.priority,
            pinned: t.pinned,
            recurring: true,
            completed: false,
            archived: false,
            position: currentPos, // Posição sequencial e limpa (0, 1, 2...)
          };
        });

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

export function useReorderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      sectionId,
      reorderedTasks,
    }: {
      slug: string;
      sectionId: number;
      reorderedTasks: { id: number; position: number }[];
    }) => {
      // Batch upsert em um único roundtrip HTTP atômico e escopado
      const { error } = await supabase
        .from("tasks")
        .upsert(
          reorderedTasks.map(t => ({ 
            id: t.id, 
            section_id: sectionId, 
            position: t.position 
          })),
          { onConflict: "id" }
        );

      if (error) throw error;

      return { success: true };
    },
    // Optimistic UI Update (Instantâneo Local)
    onMutate: async ({ slug, sectionId, reorderedTasks }) => {
      const queryKey = getListTasksQueryKey(slug);
      
      // Cancelar queries ativas para evitar race conditions
      await queryClient.cancelQueries({ queryKey });

      // Salvar snapshot do estado anterior
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      // Atualizar localmente o cache de tarefas de forma otimista
      if (previousTasks) {
        const reorderedMap = new Map(reorderedTasks.map(t => [t.id, t.position]));
        
        const optimisticTasks = previousTasks.map(task => {
          if (task.sectionId === sectionId && reorderedMap.has(task.id)) {
            return {
              ...task,
              position: reorderedMap.get(task.id)!,
            };
          }
          return task;
        });

        // Ordenar instantaneamente o cache local para evitar glitches visuais
        optimisticTasks.sort((a, b) => a.position - b.position);

        queryClient.setQueryData<Task[]>(queryKey, optimisticTasks);
      }

      return { previousTasks };
    },
    onError: (err, { slug }, context) => {
      // Rollback imediato no client em caso de falha de rede física
      if (context?.previousTasks) {
        queryClient.setQueryData(getListTasksQueryKey(slug), context.previousTasks);
      }
    },
    onSettled: (data, error, { slug }) => {
      // Sincronização final de segurança e estatísticas
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
    },
  });
}
