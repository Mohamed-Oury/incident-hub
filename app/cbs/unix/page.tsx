"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_UNIX_COMMANDS } from "@/modules/cbs/cbs-data";

export default function CbsUnixPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Extraire les catégories uniques
  const categories = ["ALL", ...Array.from(new Set(CBS_UNIX_COMMANDS.map((c) => c.category)))];

  const filteredCommands = CBS_UNIX_COMMANDS.filter((cmd) => {
    const matchesCategory = selectedCategory === "ALL" || cmd.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      cmd.command.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.outputInterpretation.toLowerCase().includes(q) ||
      cmd.usageExample.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <AppShell pageTitle="120 Commandes AIX & Unix Bancaire" eyebrow="EXPLOITATION SYSTÈME & RUN">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* En-tête & Filtres */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>
                Référentiel CLI AIX / Linux de Production
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                {CBS_UNIX_COMMANDS.length} commandes répertoriées pour diagnostiquer la CPU, les disques, les processus batch et les verrous IPC.
              </p>
            </div>

            <div style={{ minWidth: "280px" }}>
              <input
                type="text"
                placeholder="Filtrer (ex: errpt, lsvg, kill, memory)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-subtle)",
                }}
              />
            </div>
          </div>

          {/* Chips Catégories */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "16px",
                    border: isSelected ? "1px solid #0284c7" : "1px solid var(--border-light)",
                    background: isSelected ? "#0284c7" : "var(--bg-subtle)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat === "ALL" ? `Tout (${CBS_UNIX_COMMANDS.length})` : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille des commandes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
          {filteredCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid var(--border-light)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(2, 132, 199, 0.1)",
                      color: "#0284c7",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {cmd.category}
                  </span>
                </div>

                {/* Bloc Commande avec bouton copier */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <code style={{ color: "#38bdf8", fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 700, wordBreak: "break-all" }}>
                    {cmd.command}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd.command)}
                    style={{
                      background: copiedCmd === cmd.command ? "#10b981" : "rgba(255,255,255,0.1)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "3px 7px",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    {copiedCmd === cmd.command ? "Copié !" : "Copier"}
                  </button>
                </div>

                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                  {cmd.description}
                </div>

                {cmd.usageExample && (
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                    <strong style={{ color: "var(--text-muted)" }}>Exemple :</strong>{" "}
                    <code style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{cmd.usageExample}</code>
                  </div>
                )}

                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  <strong style={{ color: "var(--text-muted)" }}>Interprétation :</strong> {cmd.outputInterpretation}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            Aucune commande trouvée pour &quot;{searchTerm}&quot;
          </div>
        )}

      </div>
    </AppShell>
  );
}
