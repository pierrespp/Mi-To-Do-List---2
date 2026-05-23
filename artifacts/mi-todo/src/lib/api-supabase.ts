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
  completedAt?: string | null;
}

export interface WorkspaceStats {
  total: number;
  completed: number;
  pinned: number;
}

export interface HistoricalTask {
  title: string;
  completedAt: string;
}

export interface DailyHistory {
  id: number;
  workspaceId: number;
  date: string;
  tasks: HistoricalTask[];
  createdAt: string;
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
  completedAt: t.completed_at || null,
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
        .order("position", { ascending: true })
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
    mutationFn: async ({
      slug,
      sectionId,
      customDate,
      resetWeeklyOnly,
    }: {
      slug: string;
      sectionId?: number;
      customDate?: string;
      resetWeeklyOnly?: boolean;
    }) => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) throw new Error("Workspace not found");

      // 1. Encontrar seções semanais para excluí-las ou incluí-las
      const { data: weeklySections } = await supabase
        .from("sections")
        .select("id")
        .eq("workspace_id", workspace.id)
        .ilike("name", "%semana%");

      const weeklyIds = weeklySections ? weeklySections.map(s => s.id) : [];

      // Caso especial: Reiniciar apenas as tarefas semanais
      if (resetWeeklyOnly) {
        if (weeklyIds.length > 0) {
          await supabase
            .from("tasks")
            .update({ completed: false })
            .eq("workspace_id", workspace.id)
            .eq("archived", false)
            .in("section_id", weeklyIds);
        }
        return { success: true };
      }

      // 1. Histórico: Se for reset completo (sem sectionId), capturar as tarefas concluídas ativas (ignorando semanais)
      if (sectionId === undefined) {
        let completedQuery = supabase
          .from("tasks")
          .select("title, completed_at, created_at, section_id")
          .eq("workspace_id", workspace.id)
          .eq("completed", true)
          .eq("archived", false);
        
        if (weeklyIds.length > 0) {
          completedQuery = completedQuery.not("section_id", "in", `(${weeklyIds.join(",")})`);
        }

        const { data: completedTasks } = await completedQuery;

        if (completedTasks && completedTasks.length > 0) {
          // Agrupar por data (YYYY-MM-DD) ou usar customDate informada
          const groups: Record<string, { title: string; completedAt: string }[]> = {};
          
          for (const t of completedTasks) {
            const dateStr = customDate 
              ? customDate 
              : (t.completed_at 
                ? t.completed_at.split('T')[0] 
                : (t.created_at ? t.created_at.split('T')[0] : new Date().toISOString().split('T')[0]));
            
            if (!groups[dateStr]) {
              groups[dateStr] = [];
            }
            
            groups[dateStr].push({
              title: t.title,
              completedAt: t.completed_at || new Date().toISOString()
            });
          }

          // Para cada dia de conclusão, salvar de forma cumulativa e segura
          for (const [dateKey, newTasks] of Object.entries(groups)) {
            try {
              // Verificar se já existe histórico para este dia e workspace
              const { data: existingRecord } = await supabase
                .from("daily_history")
                .select("id, tasks")
                .eq("workspace_id", workspace.id)
                .eq("date", dateKey)
                .maybeSingle();

              if (existingRecord) {
                // Mesclar tarefas sem duplicar por título
                const existingTasks = Array.isArray(existingRecord.tasks) ? existingRecord.tasks : [];
                const mergedTasks = [...existingTasks];
                
                for (const nt of newTasks) {
                  if (!mergedTasks.some((et: any) => et.title === nt.title)) {
                    mergedTasks.push(nt);
                  }
                }

                await supabase
                  .from("daily_history")
                  .update({ tasks: mergedTasks })
                  .eq("id", existingRecord.id);
              } else {
                // Inserir novo registro histórico
                await supabase
                  .from("daily_history")
                  .insert({
                    workspace_id: workspace.id,
                    tasks: newTasks,
                    date: dateKey
                  });
              }
            } catch (historyError) {
              console.error(`Falha ao salvar histórico diário para a data ${dateKey}:`, historyError);
            }
          }
        }
      }

      // 2. Desmarcar todas as tarefas ativas do workspace/seção (completed = false)
      let updateQuery = supabase
        .from("tasks")
        .update({ completed: false })
        .eq("workspace_id", workspace.id)
        .eq("archived", false);

      if (sectionId !== undefined) {
        updateQuery = updateQuery.eq("section_id", sectionId);
      } else if (weeklyIds.length > 0) {
        // Ignorar tarefas semanais no reset de turno completo
        updateQuery = updateQuery.not("section_id", "in", `(${weeklyIds.join(",")})`);
      }
      await updateQuery;

      // 3. Turno: Se for reset completo (sem sectionId), criar novo turno e associar tarefas ativas (ignorando semanais)
      if (sectionId === undefined) {
        const { data: shift, error: shiftError } = await supabase
          .from("shifts")
          .insert({ workspace_id: workspace.id })
          .select()
          .single();
        
        if (!shiftError && shift) {
          let associateQuery = supabase
            .from("tasks")
            .update({ shift_id: shift.id })
            .eq("workspace_id", workspace.id)
            .eq("archived", false);
          
          if (weeklyIds.length > 0) {
            associateQuery = associateQuery.not("section_id", "in", `(${weeklyIds.join(",")})`);
          }
          await associateQuery;
        }
      }

      return { success: true };
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
      queryClient.invalidateQueries({ queryKey: ["daily-history", slug] });
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
      sectionId: number | null;
      reorderedTasks: Task[];
    }) => {
      // Batch upsert em um único roundtrip HTTP atômico e escopado com campos completos
      const { error } = await supabase
        .from("tasks")
        .upsert(
          reorderedTasks.map(t => ({ 
            id: t.id, 
            workspace_id: t.workspaceId,
            section_id: t.sectionId,
            shift_id: t.shiftId,
            title: t.title,
            completed: t.completed,
            priority: t.priority,
            pinned: t.pinned,
            recurring: t.recurring,
            archived: t.archived,
            position: t.position,
            created_at: t.createdAt
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

/* ─── Daily History ─────────────────────────────────────────── */
export function useListDailyHistory(slug: string) {
  return useQuery<DailyHistory[]>({
    queryKey: ["daily-history", slug],
    queryFn: async () => {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("slug", slug)
        .single();
      
      if (!workspace) return [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("daily_history")
        .select("*")
        .eq("workspace_id", workspace.id)
        .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
        .order("date", { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        workspaceId: item.workspace_id,
        date: item.date,
        tasks: item.tasks,
        createdAt: item.created_at
      }));
    }
  });
}

