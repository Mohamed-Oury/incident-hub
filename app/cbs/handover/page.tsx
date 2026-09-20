"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";

interface BodCheckItem {
  id: string;
  category: string;
  label: string;
  targetTime: string;
  status: "OK" | "WARNING" | "KO" | "PENDING";
  responsible: string;
}

export default function CbsHandoverPage() {
  const [operatorName, setOperatorName] = useState("Ingénieur Exploitation N2");
  const [eodStartTime, setEodStartTime] = useState("23:30");
  const [eodEndTime, setEodEndTime] = useState("04:45");
  const [balanceStatus, setBalanceStatus] = useState("Équilibrée (Écart = 0)");
  const [rmanBackup, setRmanBackup] = useState("Effectuée avec succès (Full L0)");
  const [notableIncidents, setNotableIncidents] = useState("Aucun blocage majeur. Verrou transitoire sur BKCOM libéré à 02h43.");
  const [copied, setCopied] = useState(false);

  // Checklist BOD Interactive
  const [checklist, setChecklist] = useState<BodCheckItem[]>([
    { id: "chk_1", category: "Système", label: "Filesystems AIX (/amp, /oradata) < 80%", targetTime: "05:00", status: "OK", responsible: "Admin Système" },
    { id: "chk_2", category: "Base de données", label: "Sauvegarde RMAN de nuit intègre", targetTime: "05:15", status: "OK", responsible: "DBA Astreinte" },
    { id: "chk_3", category: "Comptabilité", label: "Balance générale journalière strictement à 0", targetTime: "05:30", status: "OK", responsible: "Comptable Nuit" },
    { id: "chk_4", category: "Applicatif", label: "Démons Tuxedo & Weblogic démarrés (tmadmin / psr)", targetTime: "06:00", status: "OK", responsible: "Exploitant N2" },
    { id: "chk_5", category: "Monétique", label: "Fichiers de compensation VISA & GIM intégrés", targetTime: "06:30", status: "OK", responsible: "Équipe Monétique" },
    { id: "chk_6", category: "Réseau Agences", label: "Ouverture des guichets et liaisons WAN agences", targetTime: "07:00", status: "PENDING", responsible: "Support Agences" },
  ]);

  const toggleStatus = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: Record<string, "OK" | "WARNING" | "KO" | "PENDING"> = {
          PENDING: "OK",
          OK: "WARNING",
          WARNING: "KO",
          KO: "PENDING"
        };
        return { ...item, status: nextStatus[item.status] };
      })
    );
  };

  // Génération du rapport Markdown
  const generateMarkdownReport = () => {
    return `### 📋 RAPPORT DE PASSATION DE CONSIGNES EOD / BOD - CBS AMPLITUDE
**Date :** ${new Date().toLocaleDateString("fr-FR")}
**Astreinte :** ${operatorName}

#### ⏱️ Métriques de Clôture EOD
- **Début EOD :** ${eodStartTime} | **Fin EOD :** ${eodEndTime}
- **Balance Comptable :** ${balanceStatus}
- **Sauvegarde RMAN :** ${rmanBackup}

#### 🚨 Incidents & Événements Notables
${notableIncidents}

#### ✅ Statut de la Checklist BOD (Ouverture Agences)
${checklist.map((c) => `- [${c.status === "OK" ? "x" : " "}] **${c.label}** (${c.targetTime}) : **${c.status}** (${c.responsible})`).join("\n")}

---
*Généré automatiquement par Payway Incident Hub - CBS Amplitude Run Edition.*`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell
      pageTitle="Handover d'Astreinte & Checklist BOD"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BANDEAU SUPÉRIEUR */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "1px solid #3b82f6",
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
              background: "#3b82f6",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase"
            }}>
              Passation de Consignes IT Banking
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
              Fiche de Handover EOD & Checklist Interactive BOD
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              Structurez le passage de relais entre l'équipe d'astreinte nocturne et l'équipe d'exploitation du matin avant l'ouverture des guichets.
            </p>
          </div>

          <button
            onClick={handleCopyReport}
            style={{
              background: copied ? "#22c55e" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {copied ? "Rapport Copié !" : "📋 Copier Rapport Markdown"}
          </button>
        </div>

        {/* 2 COLONNES : FORMULAIRE DE PASSATION & CHECKLIST BOD */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* FORMULAIRE DES MÉTRIQUES EOD */}
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
              1. Métriques de Clôture Journalière (EOD)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                  Ingénieur d'Astreinte
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                  Balance Générale
                </label>
                <input
                  type="text"
                  value={balanceStatus}
                  onChange={(e) => setBalanceStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                  Heure Début EOD
                </label>
                <input
                  type="text"
                  value={eodStartTime}
                  onChange={(e) => setEodStartTime(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                  Heure Fin EOD
                </label>
                <input
                  type="text"
                  value={eodEndTime}
                  onChange={(e) => setEodEndTime(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                Statut Sauvegarde SGBD (RMAN / Backup)
              </label>
              <input
                type="text"
                value={rmanBackup}
                onChange={(e) => setRmanBackup(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
                Journal des Incidents & Consignes Spéciales Matin
              </label>
              <textarea
                value={notableIncidents}
                onChange={(e) => setNotableIncidents(e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #334155", color: "#f8fafc", fontSize: "13px" }}
              />
            </div>
          </div>

          {/* CHECKLIST BOD INTERACTIVE */}
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
                2. Checklist Interactive BOD (Ouverture)
              </h3>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Cliquez pour changer l'état</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                      {item.category} • Heure cible: {item.targetTime} • Resp: {item.responsible}
                    </div>
                  </div>

                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background:
                      item.status === "OK" ? "rgba(34, 197, 94, 0.2)" :
                      item.status === "WARNING" ? "rgba(234, 179, 8, 0.2)" :
                      item.status === "KO" ? "rgba(239, 68, 68, 0.2)" : "#334155",
                    color:
                      item.status === "OK" ? "#4ade80" :
                      item.status === "WARNING" ? "#facc15" :
                      item.status === "KO" ? "#f87171" : "#94a3b8"
                  }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
