import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ArticleTable({ articles, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Título</TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">Categoria</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Data</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} className="hover:bg-muted/30">
              <TableCell>
                <div className="flex items-center gap-3">
                  {article.image_url && (
                    <img src={article.image_url} alt="" className="w-10 h-10 rounded-md object-cover hidden sm:block" />
                  )}
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 sm:hidden">{article.category}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="secondary" className="text-xs">{article.category}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {article.published_date
                  ? format(new Date(article.published_date), "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(article)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(article)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {articles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                Nenhuma notícia cadastrada ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}