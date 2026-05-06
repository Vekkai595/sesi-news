import React from "react";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-foreground">Sesi News</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Sesi News — Portal de Notícias Escolar. Todos os direitos reservados.
          </p>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}