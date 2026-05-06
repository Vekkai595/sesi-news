import React, { useState } from "react";
import { articlesApi } from "@/api/newsClient";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper } from "lucide-react";

export default function Home() {
  const [category, setCategory] = useState("Todos");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => articlesApi.list(),
  });

  const filtered = category === "Todos"
    ? articles
    : articles.filter((a) => a.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero section */}
      <section className="mb-10">
        <div className="relative rounded-2xl bg-primary overflow-hidden p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/60 opacity-90" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium tracking-widest uppercase">Sesi News</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
              Fique por dentro de tudo<br className="hidden sm:block" /> que acontece na nossa escola
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-xl">
              Notícias, eventos, conquistas e muito mais. O portal oficial de notícias do Sesi.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-8">
        <CategoryFilter selected={category} onSelect={setCategory} />
      </section>

      {/* Articles grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">Nenhuma notícia encontrada</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {category !== "Todos" ? "Tente outra categoria." : "As notícias aparecerão aqui quando forem publicadas."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}