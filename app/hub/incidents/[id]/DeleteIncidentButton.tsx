"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteModal } from "@/modules/ui/ConfirmDeleteModal";

export function DeleteIncidentButton({ reference, title }: { reference: string; title: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/incidents/${encodeURIComponent(reference)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la suppression.");
      }
      setShowModal(false);
      router.push("/hub/knowledge");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Impossible de supprimer l'incident.");
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={deleting}
        onClick={() => setShowModal(true)}
        style={{
          fontSize: "0.85rem",
          padding: "0.5rem 1rem",
          fontWeight: 700,
          borderRadius: "10px",
          border: "1px solid #fecaca",
          background: "#fef2f2",
          color: "#dc2626",
          cursor: deleting ? "wait" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.15s ease",
        }}
      >
        <span>🗑️</span>
        <span>{deleting ? "Suppression..." : "Supprimer l'incident"}</span>
      </button>

      <ConfirmDeleteModal
        isOpen={showModal}
        title="Supprimer la fiche d'incident ?"
        description="Cette action est irréversible. L'incident et son analyse forensique seront définitivement supprimés de la base de connaissances."
        itemBadge={{
          icon: "🚨",
          label: reference,
          details: title,
        }}
        confirmButtonLabel="Supprimer définitivement"
        cancelButtonLabel="Annuler"
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}
