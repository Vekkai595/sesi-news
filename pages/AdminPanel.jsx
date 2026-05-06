import React, { useState, useEffect } from "react";
import { articlesApi, auth, isSupabaseConfigured } from "@/api/newsClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Newspaper, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ArticleForm from "../components/admin/ArticleForm";
import ArticleTable from "../components/admin/ArticleTable";
import AdminLogin from "./AdminLogin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("sesi_admin") === "true");
  const [checkingLogin, setCheckingLogin] = useState(isSupabaseConfigured);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkSupabaseSession = async () => {
      if (!isSupabaseConfigured) return;
      const hasSession = auth.hasSession();
      setLoggedIn(hasSession);
      if (hasSession) sessionStorage.setItem("sesi_admin", "true");
      setCheckingLogin(false);
    };

    checkSupabaseSession();
  }, []);

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => articlesApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => articlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setShowForm(false);
      toast({ title: "Notícia publicada com sucesso!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => articlesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setShowForm(false);
      setEditingArticle(null);
      toast({ title: "Notícia atualizada com sucesso!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setDeleteTarget(null);
      toast({ title: "Notícia excluída com sucesso!" });
    },
  });

  const handleSave = async (formData) => {
    if (editingArticle) {
      await updateMutation.mutateAsync({ id: editingArticle.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  if (checkingLogin) {
    return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center text-muted-foreground">Verificando login...</div>;
  }

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured) auth.logout();
    sessionStorage.removeItem("sesi_admin");
    setLoggedIn(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as notícias do Sesi News.</p>
        </div>
        <div className="flex items-center gap-2">
          {!showForm && (
            <Button onClick={() => { setEditingArticle(null); setShowForm(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Nova Notícia
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={handleLogout} title="Sair">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              {editingArticle ? "Editar Notícia" : "Nova Notícia"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ArticleForm
              article={editingArticle}
              onSave={handleSave}
              onCancel={handleCancelForm}
            />
          </CardContent>
        </Card>
      )}

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Todas as Notícias ({articles.length})</h2>
      </div>

      <ArticleTable
        articles={articles}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notícia?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(deleteTarget.id)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}