import React from "react";
import { articlesApi } from "@/api/newsClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const pathParts = window.location.pathname.split("/");
  const articleId = pathParts[pathParts.length - 1];

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      return articlesApi.findById(articleId);
    },
    enabled: !!articleId,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-xl font-bold mb-2">Notícia não encontrada</h2>
        <p className="text-muted-foreground mb-6">A notícia que você procura não existe ou foi removida.</p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Button>
        </Link>
      </div>
    );
  }

  const dateStr = article.published_date
    ? format(new Date(article.published_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(article.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const imageUrl = article.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop";

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar às notícias
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <Badge className="bg-primary/10 text-primary border-0 font-medium">
          <Tag className="w-3 h-3 mr-1" />
          {article.category}
        </Badge>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr}
        </span>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
        {article.title}
      </h1>

      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        {article.summary}
      </p>

      <div className="rounded-2xl overflow-hidden mb-8 border border-border">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
        {article.content}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar à página inicial
          </Button>
        </Link>
      </div>
    </article>
  );
}