import { useListWorkspaces, useCreateWorkspace, getListWorkspacesQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: workspaces, isLoading } = useListWorkspaces();
  const createWorkspace = useCreateWorkspace();
  
  const [name, setName] = useState("");
  
  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      setLocation(`/w/${workspaces[0].slug}`);
    }
  }, [workspaces, setLocation]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    createWorkspace.mutate({ data: { name, slug } }, {
      onSuccess: (workspace) => {
        queryClient.invalidateQueries({ queryKey: getListWorkspacesQueryKey() });
        setLocation(`/w/${workspace.slug}`);
      }
    });
  };

  if (isLoading || (workspaces && workspaces.length > 0)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-none shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary fill-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-primary">Mi To Do</CardTitle>
            <CardDescription className="text-lg mt-2 font-medium">Create your first cozy workspace</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-bold">Workspace Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Cute Tasks"
                className="h-12 text-lg rounded-2xl bg-white/50 border-primary/20 focus-visible:ring-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
              disabled={createWorkspace.isPending || !name.trim()}
            >
              {createWorkspace.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-5 h-5 mr-2" />
              )}
              Start Organizing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
