import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const categoryColors = {
  Eventos: "bg-primary/10 text-primary",
  Esportes: "bg-green-500/10 text-green-700",
  Ciência: "bg-purple-500/10 text-purple-700",
  Cultura: "bg-orange-500/10 text-orange-700",
  Tecnologia: "bg-cyan-500/10 text-cyan-700",
  Comunidade: "bg-pink-500/10 text-pink-700",
  Educação: "bg-amber-500/10 text-amber-700",
};

export default function ArticleCard({ article, index }) {
  const imageUrl = article.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop";
  const dateStr = article.published_date
    ? format(new Date(article.published_date), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : format(new Date(article.created_date), "dd 'de' MMMM, yyyy", { locale: ptBR });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={`/noticia/${article.id}`} className="group block">
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="aspect-[16/10] overflow-hidden relative">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${categoryColors[article.category] || "bg-muted text-muted-foreground"} border-0 font-medium text-xs`}>
                {article.category}
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {article.summary}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
              Ler notícia <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}