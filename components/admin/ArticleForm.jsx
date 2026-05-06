import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadImageLocally } from "@/api/newsClient";
import { Save, X, Upload, Loader2 } from "lucide-react";

const CATEGORIES = ["Eventos", "Esportes", "Ciência", "Cultura", "Tecnologia", "Comunidade", "Educação"];

export default function ArticleForm({ article, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: article?.title || "",
    summary: article?.summary || "",
    content: article?.content || "",
    category: article?.category || "Eventos",
    image_url: article?.image_url || "",
    published_date: article?.published_date || new Date().toISOString().split("T")[0],
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileUrl = await uploadImageLocally(file);
    handleChange("image_url", fileUrl);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Título da notícia"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data de Publicação</Label>
          <Input
            id="date"
            type="date"
            value={form.published_date}
            onChange={(e) => handleChange("published_date", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumo *</Label>
        <Textarea
          id="summary"
          value={form.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Um breve resumo da notícia..."
          rows={2}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Texto Completo *</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Escreva o texto completo da notícia aqui..."
          rows={8}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem</Label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Enviando..." : "Enviar imagem"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
          )}
        </div>
        <Input
          value={form.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
          placeholder="Ou cole a URL da imagem aqui"
          className="mt-2"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {article ? "Salvar Alterações" : "Publicar Notícia"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
          <X className="w-4 h-4" /> Cancelar
        </Button>
      </div>
    </form>
  );
}