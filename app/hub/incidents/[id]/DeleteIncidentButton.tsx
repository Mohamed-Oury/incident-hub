"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteIncidentButton({ reference, title }: { reference: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Confirmez-vous la suppression définitive de l'incident ${reference} ("${title}") ?`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/incidents/${encodeURIComponent(reference)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression.");
      }
      router.push("/hub/knowledge");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Impossible de supprimer l'incident.");
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={handleDelete}
      style={{
        fontSize: "0.85rem",
        padding: "0.5rem 1rem",
        fontWeight: 700,
        borderRadius: "10px",
        border: "1px solid #fecaca",
        background: "#fef2f2",
        color: "#dc2626",
        cursor: deleting ? "wait" : "pointer",
      }}
    >
      {deleting ? "Suppression..." : "🗑️ Supprimer l'incident"}
    </button>
  );
}
