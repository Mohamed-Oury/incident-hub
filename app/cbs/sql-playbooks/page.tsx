"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_SQL_PLAYBOOKS, CbsSqlQuery } from "@/modules/cbs/cbs-advanced-data";

export default function CbsSqlPlaybooksPage() {
  const [selectedQuery, setSelectedQuery] = useState<CbsSqlQuery>(CBS_SQL_PLAYBOOKS[0]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    AGENCE: "%",
    SEUIL_PCT: "85",
    COMPTE_PREFIX: "371",
    JOURS: "2"
  });
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Génération du SQL avec les paramètres remplacés
  const getInterpolatedSql = () => {
    let sql = selectedQuery.sql;
    selectedQuery.parameters.forEach((param) => {
      const val = paramValues[param.name] || param.defaultValue;
      sql = sql.replaceAll(`:${param.name}`, val);
    });
    return sql;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getInterpolatedSql());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredQueries = CBS_SQL_PLAYBOOKS.filter((q) => {
    const matchesCategory = activeCategory === "ALL" || q.category === activeCategory;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.sql.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell
      pageTitle="Requêtes SQL & Playbooks SGBD Sécurisés"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BANDEAU SUPÉRIEUR */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
          border: "1px solid #4338ca",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{
              background: "#4f46e5",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase"
            }}>
              Oracle 19c & Informix Dynamic Server
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
              Bibliothèque de Requêtes de Contrôle & Diagnostic SGBD
            </h2>
            <p style={{ color: "#c7d2fe", fontSize: "14px", margin: 0 }}>
              Requêtes prêtes à l'emploi avec substitution dynamique des paramètres métier (sans risque d'injection).
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ background: "#1e293b", padding: "8px 14px", borderRadius: "8px", border: "1px solid #334155", fontSize: "13px", color: "#38bdf8" }}>
              🛡️ Mode Lecture Seule Sécurisé
            </span>
          </div>
        </div>

        {/* FILTRES PAR CATÉGORIES */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {["ALL", "EQUILIBRE", "PERFORMANCE", "AUDIT"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: activeCategory === cat ? "1px solid #6366f1" : "1px solid #334155",
                background: activeCategory === cat ? "#4f46e5" : "#1e293b",
                color: activeCategory === cat ? "#ffffff" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              {cat === "ALL" ? "Toutes les Requêtes" : cat}
            </button>
          ))}
          <input
            type="text"
            placeholder="Rechercher une table, un code SQL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#f8fafc",
              fontSize: "13px",
              minWidth: "260px"
            }}
          />
        </div>

        {/* CONTENU PRINCIPAL : LISTE & DÉTAIL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "24px" }}>
          
          {/* LISTE DES REQUÊTES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredQueries.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuery(q)}
                style={{
                  background: selectedQuery.id === q.id ? "#1e293b" : "#0f172a",
                  border: selectedQuery.id === q.id ? "2px solid #6366f1" : "1px solid #334155",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: q.category === "EQUILIBRE" ? "rgba(34, 197, 94, 0.2)" : q.category === "PERFORMANCE" ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                    color: q.category === "EQUILIBRE" ? "#4ade80" : q.category === "PERFORMANCE" ? "#f87171" : "#60a5fa"
                  }}>
                    {q.category}
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{q.dbType}</span>
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                  {q.title}
                </h4>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                  {q.description}
                </p>
              </div>
            ))}
          </div>

          {/* DÉTAIL DE LA REQUÊTE SÉLECTIONNÉE */}
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
                  {selectedQuery.title}
                </h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Base cible : <strong>{selectedQuery.dbType}</strong> | Niveau de risque : <strong style={{ color: "#22c55e" }}>{selectedQuery.riskLevel}</strong>
                </span>
              </div>

              <button
                onClick={handleCopy}
                style={{
                  background: copied ? "#22c55e" : "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {copied ? "Copié !" : "Copier le SQL"}
              </button>
            </div>

            {/* FORMULAIRE DES PARAMÈTRES DYNAMIQUES */}
            {selectedQuery.parameters.length > 0 && (
              <div style={{ background: "#0f172a", borderRadius: "8px", border: "1px solid #334155", padding: "14px", marginBottom: "18px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", marginBottom: "10px" }}>
                  Paramètres de la requête :
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {selectedQuery.parameters.map((param) => (
                    <div key={param.name}>
                      <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                        {param.label} (:{param.name})
                      </label>
                      <input
                        type="text"
                        value={paramValues[param.name] ?? param.defaultValue}
                        onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          background: "#1e293b",
                          border: "1px solid #475569",
                          color: "#f8fafc",
                          fontSize: "12px"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOC SQL RENDU */}
            <div style={{ position: "relative", marginBottom: "18px" }}>
              <pre style={{
                background: "#090d16",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #334155",
                color: "#38bdf8",
                fontFamily: "monospace",
                fontSize: "13px",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                overflowX: "auto"
              }}>
                {getInterpolatedSql()}
              </pre>
            </div>

            {/* CONSEIL D'EXÉCUTION & ANALYSE */}
            <div style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "8px",
              padding: "14px"
            }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#60a5fa", marginBottom: "4px" }}>
                💡 Recommandation d'interprétation :
              </div>
              <p style={{ fontSize: "13px", color: "#e2e8f0", margin: 0, lineHeight: "1.4" }}>
                {selectedQuery.executionAdvice}
              </p>
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
