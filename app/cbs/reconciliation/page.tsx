"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_RECONCILIATION_DATA, CbsReconciliationRecord } from "@/modules/cbs/cbs-advanced-data";

export default function CbsReconciliationPage() {
  const [records, setRecords] = useState<CbsReconciliationRecord[]>(CBS_RECONCILIATION_DATA);
  const [selectedRecord, setSelectedRecord] = useState<CbsReconciliationRecord>(CBS_RECONCILIATION_DATA[1]);
  const [networkFilter, setNetworkFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredRecords = records.filter((r) => {
    const matchesNet = networkFilter === "ALL" || r.network === networkFilter;
    const matchesStat = statusFilter === "ALL" || r.cbsStatus === statusFilter;
    return matchesNet && matchesStat;
  });

  const totalAmount = records.reduce((acc, r) => acc + r.amount, 0);
  const suspenseCount = records.filter((r) => r.cbsStatus === "SUSPENSE" || r.cbsStatus === "REJECTED").length;

  return (
    <AppShell
      pageTitle="Réconciliation & Compensation Monétique ↔ CBS"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* EN-TÊTE STATS RÉCONCILIATION */}
        <div style={{
          background: "linear-gradient(135deg, #064e3b, #0f172a)",
          border: "1px solid #059669",
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
              background: "#059669",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase"
            }}>
              Passerelle Monétique ↔ Amplitude Core Banking
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
              Suivi du Clearing & Imputation des Fichiers de Règlement
            </h2>
            <p style={{ color: "#a7f3d0", fontSize: "14px", margin: 0 }}>
              Contrôle du déversement des fichiers Visa (BASE II), Mastercard (IPM) et GIM-UEMOA dans les comptes techniques Amplitude.
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ background: "#0f172a", padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Total Compensé</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#34d399" }}>{totalAmount.toLocaleString()} XOF</div>
            </div>
            <div style={{ background: "#0f172a", padding: "12px 16px", borderRadius: "8px", border: "1px solid #ef4444" }}>
              <div style={{ fontSize: "11px", color: "#f87171", textTransform: "uppercase" }}>Suspens / Rejets</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#ef4444" }}>{suspenseCount} dossiers</div>
            </div>
          </div>
        </div>

        {/* FILTRES */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>Réseau :</span>
          {["ALL", "VISA", "MASTERCARD", "GIM_UEMOA"].map((net) => (
            <button
              key={net}
              onClick={() => setNetworkFilter(net)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: networkFilter === net ? "1px solid #10b981" : "1px solid #334155",
                background: networkFilter === net ? "#059669" : "#1e293b",
                color: networkFilter === net ? "#ffffff" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              {net}
            </button>
          ))}

          <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, marginLeft: "12px" }}>Statut :</span>
          {["ALL", "MATCHED", "SUSPENSE", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                border: statusFilter === st ? "1px solid #3b82f6" : "1px solid #334155",
                background: statusFilter === st ? "#2563eb" : "#1e293b",
                color: statusFilter === st ? "#ffffff" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* TABLEAU DES OPÉRATIONS & DÉTAIL */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px" }}>
          
          {/* LISTE DES TRANSACTIONS */}
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", overflow: "hidden" }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #334155", fontWeight: 700, color: "#f8fafc" }}>
              Lignes de compensation en cours de traitement
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#0f172a", color: "#94a3b8", borderBottom: "1px solid #334155" }}>
                    <th style={{ padding: "12px 14px" }}>Réseau / Fichier</th>
                    <th style={{ padding: "12px 14px" }}>Carte / Compte</th>
                    <th style={{ padding: "12px 14px" }}>Montant</th>
                    <th style={{ padding: "12px 14px" }}>Statut CBS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedRecord(r)}
                      style={{
                        borderBottom: "1px solid #334155",
                        cursor: "pointer",
                        background: selectedRecord === r ? "rgba(5, 150, 105, 0.15)" : "transparent"
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600, color: "#f8fafc" }}>{r.network}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{r.fileReference}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontFamily: "monospace", color: "#cbd5e1" }}>{r.cardMasked}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Cpt: {r.accountNumber}</div>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#f8fafc" }}>
                        {r.amount.toLocaleString()} {r.currency}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background:
                            r.cbsStatus === "MATCHED" ? "rgba(34, 197, 94, 0.2)" :
                            r.cbsStatus === "SUSPENSE" ? "rgba(234, 179, 8, 0.2)" :
                            r.cbsStatus === "REJECTED" ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)",
                          color:
                            r.cbsStatus === "MATCHED" ? "#4ade80" :
                            r.cbsStatus === "SUSPENSE" ? "#facc15" :
                            r.cbsStatus === "REJECTED" ? "#f87171" : "#60a5fa"
                        }}>
                          {r.cbsStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DÉTAIL DU DOSSIER DE RÉCONCILIATION */}
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "14px" }}>
              Détail & Schéma d'Imputation
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Code Autorisation (ISO 8583)</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#38bdf8", fontFamily: "monospace" }}>
                  {selectedRecord.authCode}
                </div>
              </div>

              <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Compte d'Attente / Suspens Imputé</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#facc15", fontFamily: "monospace" }}>
                  {selectedRecord.glSuspenseAccount} (Compte Technique GL)
                </div>
              </div>

              {selectedRecord.rejectReason && (
                <div style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid #ef4444",
                  padding: "12px",
                  borderRadius: "8px"
                }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#f87171", textTransform: "uppercase" }}>Motif du rejet / anomalie</div>
                  <div style={{ fontSize: "13px", color: "#fecaca", marginTop: "4px" }}>
                    {selectedRecord.rejectReason}
                  </div>
                </div>
              )}

              <div style={{
                background: "rgba(5, 150, 105, 0.1)",
                border: "1px solid #059669",
                padding: "12px",
                borderRadius: "8px"
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", textTransform: "uppercase" }}>Protocole de Résolution</div>
                <div style={{ fontSize: "13px", color: "#d1fae5", marginTop: "4px", lineHeight: "1.4" }}>
                  {selectedRecord.solution}
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>Écriture de compensation générée :</div>
                <pre style={{
                  background: "#090d16",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #334155",
                  fontSize: "11px",
                  color: "#a7f3d0",
                  fontFamily: "monospace"
                }}>
{`DÉBIT  : Cpt ${selectedRecord.cbsAccountFound ? selectedRecord.accountNumber : selectedRecord.glSuspenseAccount}  ${selectedRecord.amount} ${selectedRecord.currency}
CRÉDIT : Cpt 37110000 (Règlement Net) ${selectedRecord.amount} ${selectedRecord.currency}`}
                </pre>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
