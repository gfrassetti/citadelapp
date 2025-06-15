"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, PencilIcon } from "lucide-react";

export default function UserInfoActions({ editMode, loading, onEdit, onCancel, onSave }) {
  return (
    <>
      {!editMode ? (
        <Button className="w-min ml-auto" variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon className="w-4 h-4 mr-2" /> Editar
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            size="sm"
            className="bg-neutral-900 text-white hover:bg-neutral-800"
            disabled={loading}
            onClick={onSave}
          >
            {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      )}
    </>
  );
}
