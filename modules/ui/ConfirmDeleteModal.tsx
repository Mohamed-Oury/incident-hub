"use client";

import React, { useEffect } from "react";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemBadge?: {
    icon?: string;
    label: string;
    details?: string;
  };
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title = "Confirmer la suppression",
  description = "Cette action est irréversible. L'élément sera définitivement supprimé de la base.",
  itemBadge,
  confirmButtonLabel = "Confirmer la suppression",
  cancelButtonLabel = "Annuler",
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  // Fermeture par touche Echap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Corps principal */}
        <div style={{ padding: "26px 28px 20px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#fee2e2",
                color: "#dc2626",
                display: "grid",
                placeItems: "center",
                fontSize: "22px",
                flexShrink: 0,
                border: "1px solid #fecaca",
              }}
            >
              🗑️
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
                {title}
              </h3>
              <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                {description}
              </p>
            </div>
          </div>

          {/* Badge récapitulatif de l'élément ciblé */}
          {itemBadge && (
            <div
              style={{
                marginTop: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{itemBadge.icon || "📌"}</span>
                <strong
                  style={{
                    fontSize: "13.5px",
                    color: "#0f172a",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {itemBadge.label}
                </strong>
              </div>
              {itemBadge.details && (
                <div style={{ fontSize: "12px", color: "#64748b", marginLeft: "24px" }}>
                  {itemBadge.details}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div
          style={{
            background: "#f8fafc",
            padding: "16px 28px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: "13px",
              fontWeight: 700,
              cursor: isDeleting ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {cancelButtonLabel}
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "1px solid #b91c1c",
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: isDeleting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 6px rgba(220, 38, 38, 0.3)",
              transition: "all 0.15s ease",
            }}
          >
            {isDeleting ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>🔄</span>
                Suppression...
              </>
            ) : (
              <>
                <span>🗑️</span>
                {confirmButtonLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

