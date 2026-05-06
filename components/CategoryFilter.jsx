import React from "react";
import { Button } from "@/components/ui/button";

const categories = ["Todos", "Eventos", "Esportes", "Ciência", "Cultura", "Tecnologia", "Comunidade", "Educação"];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(cat)}
          className="rounded-full text-xs font-medium"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}