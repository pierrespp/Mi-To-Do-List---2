import { useParams, Link } from "wouter";
import { 
  useGetWorkspace, 
  useListSections, 
  useListTasks, 
  useGetWorkspaceStats,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCreateSection,
  useRestartShift,
  getListTasksQueryKey,
  getGetWorkspaceStatsQueryKey,
  getListSectionsQueryKey,
  getGetWorkspaceQueryKey
} from "@workspace/api-client-react";
import { useState, KeyboardEvent, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2, Heart, Star, Sparkles, Loader2, Pin, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function WorkspacePage() {
  const params = useParams();
  const slug = params.slug!;
  const queryClient = useQueryClient();

  const { data: workspace, isLoading: wsLoading } = useGetWorkspace(slug, { query: { enabled: !!slug, queryKey: [slug, "workspace"] } });
  const { data: sections, isLoading: sectionsLoading } = useListSections(slug, { query: { enabled: !!slug, queryKey: getListSectionsQueryKey(slug) } });
  const { data: tasks, isLoading: tasksLoading } = useListTasks(slug, { query: { enabled: !!slug, queryKey: getListTasksQueryKey(slug) } });
  const { data: stats } = useGetWorkspaceStats(slug, { query: { enabled: !!slug, queryKey: getGetWorkspaceStatsQueryKey(slug) } });

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createSection = useCreateSection();
  const restartShift = useRestartShift();

  const handleCreateTask = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      createTask.mutate(
        { slug, data: { title: newTaskTitle.trim(), sectionId: selectedSectionId, priority: "medium" } },
        {
          onSuccess: () => {
            setNewTaskTitle("");
            queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
            queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
          }
        }
      );
    }
  };

  const handleCreateSection = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSectionName.trim()) {
      createSection.mutate(
        { slug, data: { name: newSectionName.trim(), emoji: "✨" } },
        {
          onSuccess: () => {
            setNewSectionName("");
            setIsAddingSection(false);
            queryClient.invalidateQueries({ queryKey: getListSectionsQueryKey(slug) });
          }
        }
      );
    }
  };

  const handleToggleTask = (taskId: number, completed: boolean) => {
    updateTask.mutate({ slug, taskId, data: { completed: !completed } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
        queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
      }
    });
  };

  const filteredTasks = tasks?.filter(t => selectedSectionId ? t.sectionId === selectedSectionId : true) || [];

  if (wsLoading || sectionsLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <div className="w-72 flex flex-col p-6 glass-card border-r shadow-sm z-10 relative">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-primary flex items-center gap-2">
            <Heart className="w-6 h-6 fill-primary" />
            {workspace?.name}
          </h1>
        </div>

        {stats && (
          <div className="mb-8 flex gap-2 flex-wrap">
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold">
              {stats.completed}/{stats.total} Done
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold bg-white/50 border-primary/20 text-primary">
              <Pin className="w-3 h-3 mr-1 inline" /> {stats.pinned} Pinned
            </Badge>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          <button
            onClick={() => setSelectedSectionId(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all ${
              selectedSectionId === null 
                ? "bg-primary text-primary-foreground shadow-md scale-105" 
                : "hover:bg-white/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-5 h-5" /> All Tasks
          </button>
          
          {sections?.map(section => (
            <button
              key={section.id}
              onClick={() => setSelectedSectionId(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all ${
                selectedSectionId === section.id 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "hover:bg-white/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{section.emoji}</span> {section.name}
            </button>
          ))}

          {isAddingSection ? (
            <Input
              autoFocus
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              onKeyDown={handleCreateSection}
              onBlur={() => setIsAddingSection(false)}
              placeholder="Section name..."
              className="mt-2 rounded-2xl bg-white/60 border-primary/20"
            />
          ) : (
            <button
              onClick={() => setIsAddingSection(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-muted-foreground hover:bg-white/60 hover:text-primary transition-all mt-2"
            >
              <Plus className="w-5 h-5" /> Add Section
            </button>
          )}
        </div>

        <div className="pt-6 mt-auto">
          <Button 
            className="w-full rounded-2xl h-14 text-lg font-bold shadow-lg hover:scale-[1.02] transition-transform bg-gradient-to-r from-primary to-secondary text-white border-0"
            onClick={() => {
              restartShift.mutate({ slug }, {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
                  queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
                }
              });
            }}
          >
            ✨ Reiniciar Turno
          </Button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto space-y-8">
          <header>
            <h2 className="text-4xl font-black text-primary flex items-center gap-3">
              {selectedSectionId 
                ? sections?.find(s => s.id === selectedSectionId)?.name 
                : "All Tasks"
              }
              <Sparkles className="w-8 h-8 text-secondary" />
            </h2>
          </header>

          <div className="relative">
            <Input
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={handleCreateTask}
              placeholder="What do we need to do today? ✨"
              className="h-16 pl-6 pr-12 text-xl rounded-full glass-card border-primary/20 shadow-md focus-visible:ring-primary focus-visible:ring-2 font-semibold placeholder:text-muted-foreground/60"
            />
            {createTask.isPending && (
              <Loader2 className="w-6 h-6 absolute right-4 top-5 animate-spin text-primary" />
            )}
          </div>

          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full glass-card bg-white/50 mb-6">
                  <Star className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-2xl font-bold text-muted-foreground mb-2">No tasks yet!</h3>
                <p className="text-muted-foreground/80 font-medium">Add a task above to get started ✨</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className={`flex items-center gap-4 p-5 rounded-3xl glass-card transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                    task.completed ? "opacity-60 bg-white/40" : "bg-white/80"
                  }`}
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      task.completed 
                        ? "bg-primary border-primary text-white" 
                        : "border-primary/40 hover:border-primary text-transparent hover:bg-primary/10"
                    }`}
                  >
                    <Check className={`w-5 h-5 ${task.completed ? "opacity-100" : "opacity-0"}`} />
                  </button>
                  
                  <span className={`flex-1 text-xl font-bold ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </span>

                  <div className="flex items-center gap-2">
                    {task.priority === "high" && (
                      <Badge className="bg-destructive/10 text-destructive border-0 rounded-full px-3 py-1 font-bold">
                        <AlertCircle className="w-3 h-3 mr-1 inline" /> High
                      </Badge>
                    )}
                    {task.pinned && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Pin className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    {task.recurring && (
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-secondary-foreground" />
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        deleteTask.mutate({ slug, taskId: task.id }, {
                          onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: getListTasksQueryKey(slug) });
                            queryClient.invalidateQueries({ queryKey: getGetWorkspaceStatsQueryKey(slug) });
                          }
                        });
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
