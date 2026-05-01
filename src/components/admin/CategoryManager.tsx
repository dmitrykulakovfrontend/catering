"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions";
import { categorySchema } from "@/lib/validations";
import { INPUT_FOCUS_RING, INPUT_ERROR_FOCUS_RING } from "@/lib/ui-classes";

export default function CategoryManager() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = categorySchema.safeParse({ name: name.trim(), order: 99 });
    if (!result.success) {
      const msg = result.error.issues[0].message;
      setError(msg);
      toast.error(msg);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await createCategory(result.data);
      toast.success("Категория создана");
      setName("");
      setOpen(false);
    } catch {
      toast.error("Ошибка создания");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:border-royal-500 hover:text-royal-500"
      >
        Добавить категорию
      </button>
    );
  }

  const inputClass = error
    ? `rounded-lg border border-red-400 bg-red-50/40 px-3 py-2 text-sm shadow-sm ${INPUT_ERROR_FOCUS_RING}`
    : `rounded-lg border border-neutral-200 px-3 py-2 text-sm shadow-sm ${INPUT_FOCUS_RING}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="Название категории"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-royal-500 px-4 py-2 text-sm font-medium text-white hover:bg-royal-600 disabled:opacity-60"
        >
          Создать
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName("");
            setError("");
          }}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
        >
          Отмена
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
