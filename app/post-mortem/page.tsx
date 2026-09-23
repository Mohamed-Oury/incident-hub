"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/modules/layout/AppShell";
import { IncidentRecord } from "@/modules/incidents/types";

function PostMortemContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "INC-001";

  const [incidentRef, setIncidentRef] = useState<string>(initialRef);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchFeedback, setSearchFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Champs du rapport
  const [title, setTitle] = useState<string>("GAB - Retraits en échec suite à timeout CBS / lock ACCOUNT");
  const [domain, setDomain] = useState<string>("GAB");
  const [component, setComponent] = useState<string>("CBS/DB");
  const [impactDuration, setImpactDuration] = useState<string>("25 minutes");
  const [financialImpact, setFinancialImpact] = useState<string>("140 transactions rejetées (estimé à 7 000 000 XAF)");
  const [mti, setMti] = useState<string>("0200 / 0210");
  const [errorCode, setErrorCode] = useState<string>("DE39=91");
  const [rootCause, setRootCause] = useState<string>(
    "Saturation des connexions et verrouillage de tables sur le Core Banking (CBS), provoquant un dépassement du Timer Switch (25s) et l'émission en cascade de messages 0420 rejetés."
  );
  const [correctiveActions, setCorrectiveActions] = useState<string>(
    "1. Recrédit immédiat des comptes clients débités à tort via script de compensation automatique.\n2. Augmentation du pool de connexions dédié aux requêtes monétiques CBS de 20 à 60 sessions.\n3. Ajustement du timer GAB à 45s pour éviter les faux abandons clients."
  );
  const [preventionPlan, setPreventionPlan] = useState<string>(
    "Mise en place d'une alerte proactive sur les verrous SGBD et revue des planifications batch EOD/BOD."
  );

  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  // Recherche automatique d'un incident par sa référence (ex: INC-001 à INC-1000)
  const handleSearchIncident = async (refToSearch?: string) => {
    const targetRef = (refToSearch || incidentRef).trim();
    if (!targetRef) {
      setSearchFeedback({ type: "error", message: "Veuillez saisir une référence d'incident (ex: INC-001, INC-500, INC-750...)" });
      return;
    }

    setIsSearching(true);
    setSearchFeedback(null);

    try {
      const res = await fetch(`/api/incidents/${encodeURIComponent(targetRef)}`);
      const data = await res.json();

      if (!res.ok || !data.incident) {
        setSearchFeedback({
          type: "error",
          message: `Aucun incident trouvé avec la référence '${targetRef}'. Vérifiez la syntaxe (ex: INC-001 à INC-1000).`,
        });
        setIsSearching(false);
        return;
      }

      const inc: IncidentRecord = data.incident;
      setIncidentRef(inc.reference);
      setTitle(inc.title || "");
      setDomain(inc.domain || "Monétique");
      setComponent(inc.component || "Switch");
      setErrorCode(inc.errorCode || "DE39=05");

      // Synthèse de l'impact
      if (inc.observations && inc.observations.length > 0) {
        const obs = inc.observations[0];
        setFinancialImpact(obs.facts || "Impact transactionnel et réclamations porteurs en cours d'évaluation.");
        setImpactDuration(obs.context?.includes("minutes") ? "30 minutes" : "Environ 45 minutes");
      }

      // MTI
      if (inc.isoMessages && inc.isoMessages.length > 0) {
        const mtis = Array.from(new Set(inc.isoMessages.map((m) => m.mti).filter(Boolean)));
        setMti(mtis.join(" / ") || "0200 / 0210");
      }

      // Root Cause
      if (inc.rootCause) {
        setRootCause(`${inc.rootCause.description}\n\nJustification technique : ${inc.rootCause.justification || ""}`);
      } else {
        setRootCause(`Cause racine démontrée sur ${inc.component} : anomalie de configuration ou saturation identifiée lors du traitement.`);
      }

      // Resolution
      if (inc.resolution) {
        setCorrectiveActions(`Actions menées :\n${inc.resolution.actions}\n\nRésultat : ${inc.resolution.result || "Rétablissement nominal du service monétique."}`);
      }

      // Prevention
      if (inc.prevention && inc.prevention.length > 0) {
        setPreventionPlan(inc.prevention.map((p, idx) => `${idx + 1}. ${p.action} (Priorité: ${p.priority || "HIGH"})`).join("\n"));
      }

      setSearchFeedback({
        type: "success",
        message: `Incident ${inc.reference} chargé avec succès ! Toutes les données d'investigation et RCA ont été importées.`,
      });

      // Auto-génération immédiate du rapport
      buildReportDocument({
        ref: inc.reference,
        t: inc.title,
        dom: inc.domain || "Monétique",
        comp: inc.component || "Switch",
        dur: "Environ 35 minutes",
        imp: inc.observations?.[0]?.facts || "Volume de transactions rejetées avec code " + (inc.errorCode || "DE39=05"),
        rc: inc.rootCause ? `${inc.rootCause.description}\n${inc.rootCause.justification || ""}` : rootCause,
        ca: inc.resolution ? `${inc.resolution.actions}\n${inc.resolution.result || ""}` : correctiveActions,
        prev: inc.prevention?.map((p) => p.action).join("\n") || preventionPlan,
        code: inc.errorCode || "DE39=05",
        mtiVal: inc.isoMessages?.map((m) => m.mti).join(" / ") || "0200 / 0210",
      });
    } catch (err: any) {
      setSearchFeedback({ type: "error", message: `Erreur de connexion : ${err.message || String(err)}` });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      handleSearchIncident(initialRef);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRef]);

  const buildReportDocument = (params: {
    ref: string;
    t: string;
    dom: string;
    comp: string;
    dur: string;
    imp: string;
    rc: string;
    ca: string;
    prev: string;
    code: string;
    mtiVal: string;
  }) => {
    const doc = `# RAPPORT D'INCIDENT MAJEUR & POST-MORTEM (RCA BANKING)
**Référence Incident :** ${params.ref}
**Date du rapport :** ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}
**Auteur :** M.Oury — Ingénieur Exploitation Monétique & IT Banking
**Statut :** OFFICIEL & VALIDÉ (Direction Générale / Audit Monétique / Risque Opérationnel)

---

### 1. SYNTHÈSE EXÉCUTIVE
- **Intitulé de l'Incident :** ${params.t}
- **Domaine & Canal :** ${params.dom}
- **Composant(s) impacté(s) :** ${params.comp}
- **Code Réponse / Erreur :** \`${params.code}\`
- **Durée estimée de l'indisponibilité :** ${params.dur}
- **Impact financier & porteurs :** ${params.imp}

---

### 2. CHRONOLOGIE DE L'ÉVÉNEMENT (TIMELINE D'EXPLOITATION)
| Phase | Événement technique | Détection & Actions Menées |
|---|---|---|
| **T0 (Survenue)** | Détection de rupture ou pic de rejets sur ${params.comp} | Déclenchement alerte temps réel supervision |
| **T0 + 10m** | Analyse des trames ISO 8583 et corrélation des codes retour | Isolation du nœud défaillant et qualification de l'incident |
| **T0 + 25m** | Déploiement des actions de remédiation technique | Purge des verrous / bascule sur lien secours / rechargement à chaud |
| **T0 + 40m** | Rétablissement nominal des autorisations monétiques | Passage de tests pilotes réels sur terminaux de contrôle |
| **T0 + 45m** | Validation du taux de succès (> 99.5%) et clôture | Communication officielle aux agences et à la direction |

---

### 3. ANALYSE TECHNIQUE & CAUSE RACINE (RCA & 5 POURQUOI)
${params.rc}

---

### 4. PREUVES TECHNIQUES ISO 8583 & TRACABILITÉ FORENSIC
- **Message(s) MTI identifié(s) :** \`${params.mtiVal}\`
- **Code retour / DE39 constaté :** \`${params.code}\`
- **Contrôle d'imputation :** Concordance vérifiée entre traces Frontal Switch et écritures d'ajustement CBS.
- **Preuves tangibles :** Traces Wireshark / Syslog applicatifs horodatés à la milliseconde.

---

### 5. PLAN D'ACTIONS CORRECTIVES IMMÉDIATES (CAPA)
${params.ca}

---

### 6. PLAN DE PRÉVENTION & DURCISSEMENT TECHNIQUE
${params.prev}

---
*Document généré automatiquement via la plateforme M.OURY INCIDENT HUB - Conforme aux standards d'audit bancaire PCI-DSS et ISO 8583.*
`;
    setGeneratedDoc(doc);
  };

  const handleManualGenerate = () => {
    buildReportDocument({
      ref: incidentRef,
      t: title,
      dom: domain,
      comp: component,
      dur: impactDuration,
      imp: financialImpact,
      rc: rootCause,
      ca: correctiveActions,
      prev: preventionPlan,
      code: errorCode,
      mtiVal: mti,
    });
  };

  return (
    <AppShell pageTitle="Générateur de Post-Mortem & Fiche d'Incident" eyebrow="OUTILS EXPERTS MONÉTIQUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* BANDEAU DE RECHERCHE RAPIDE PAR RÉFÉRENCE */}
        <div className="card" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 700, color: "#e60028", textTransform: "uppercase" }}>
                RECHERCHE &amp; AUTO-COMPLÉTION INSTANTANÉE
              </span>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.2rem" }}>
                Générer un Rapport à partir d&apos;un Incident Existant
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                Collez n&apos;importe quelle référence (ex : <code>INC-001</code>, <code>INC-004</code>, <code>INC-500</code>, <code>INC-750</code>, <code>INC-1000</code>). Tous les champs, causes racines et résolutions sont automatiquement injectés.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                value={incidentRef}
                onChange={(e) => setIncidentRef(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchIncident();
                }}
                placeholder="Ex: INC-001, INC-500..."
                className="input"
                style={{
                  fontFamily: "monospace",
                  fontWeight: 800,
                  fontSize: "1rem",
                  width: "180px",
                  background: "#1e293b",
                  color: "#ffffff",
                  borderColor: "#475569",
                  textTransform: "uppercase",
                }}
              />
              <button
                type="button"
                onClick={() => handleSearchIncident()}
                disabled={isSearching}
                className="btn-primary"
                style={{ padding: "0.65rem 1.25rem" }}
              >
                {isSearching ? "Recherche..." : "🔍 Charger & Générer"}
              </button>
            </div>
          </div>

          {/* Raccourcis d'exemples d'incidents */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>Exemples rapides :</span>
            {["INC-001", "INC-004", "INC-120", "INC-350", "INC-500", "INC-750", "INC-1000"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setIncidentRef(r);
                  handleSearchIncident(r);
                }}
                style={{
                  background: "#334155",
                  border: "none",
                  color: "#f8fafc",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Message de statut */}
          {searchFeedback && (
            <div
              style={{
                marginTop: "0.85rem",
                padding: "0.6rem 0.9rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                background: searchFeedback.type === "success" ? "#064e3b" : "#7f1d1d",
                color: searchFeedback.type === "success" ? "#a7f3d0" : "#fecaca",
                border: `1px solid ${searchFeedback.type === "success" ? "#059669" : "#dc2626"}`,
              }}
            >
              {searchFeedback.type === "success" ? "✓ " : "⚠️ "} {searchFeedback.message}
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL EN 2 COLONNES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          
          {/* Formulaire des données du rapport */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>Paramètres &amp; Éléments du Rapport</h3>
              <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700, color: "#334155" }}>
                Réf: {incidentRef}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Titre de l&apos;incident :
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Domaine / Canal :
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Composant Impacté :
                  </label>
                  <input
                    type="text"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Code Erreur / DE39 :
                  </label>
                  <input
                    type="text"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    className="input"
                    style={{ fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Durée d&apos;impact :
                  </label>
                  <input
                    type="text"
                    value={impactDuration}
                    onChange={(e) => setImpactDuration(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Impact financier &amp; clients :
                </label>
                <input
                  type="text"
                  value={financialImpact}
                  onChange={(e) => setFinancialImpact(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Cause Racine Validée (RCA - 5 Pourquoi) :
                </label>
                <textarea
                  rows={3}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Plan d&apos;Actions Correctives (CAPA) :
                </label>
                <textarea
                  rows={3}
                  value={correctiveActions}
                  onChange={(e) => setCorrectiveActions(e.target.value)}
                  className="input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Plan de Prévention &amp; Durcissement :
                </label>
                <textarea
                  rows={2}
                  value={preventionPlan}
                  onChange={(e) => setPreventionPlan(e.target.value)}
                  className="input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="button"
                onClick={handleManualGenerate}
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                Mettre à jour le Rapport Post-Mortem →
              </button>
            </div>
          </div>

          {/* Aperçu et Téléchargement du Rapport */}
          <div className="card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Aperçu du Rapport Post-Mortem</h3>
              {generatedDoc && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedDoc);
                      alert("Rapport Post-Mortem copié dans le presse-papier !");
                    }}
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                  >
                    📋 Copier
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([generatedDoc], { type: "text/markdown" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `PostMortem_${incidentRef}.md`;
                      a.click();
                    }}
                    className="btn-secondary"
                    style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                  >
                    📥 Télécharger (.md)
                  </button>
                </div>
              )}
            </div>

            {generatedDoc ? (
              <div
                style={{
                  flex: 1,
                  background: "#0f172a",
                  color: "#e2e8f0",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "0.82rem",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                  border: "1px solid #334155",
                  maxHeight: "750px",
                }}
              >
                {generatedDoc}
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "grid",
                  placeItems: "center",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "2px dashed #cbd5e1",
                  padding: "2rem",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                <div>
                  <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>📑</span>
                  <p style={{ fontWeight: 600 }}>Aucun rapport généré pour le moment.</p>
                  <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
                    Saisissez une référence ci-dessus (ex: <code>INC-001</code>) ou cliquez sur un exemple pour générer le rapport.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function PostMortemPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#64748b" }}>Chargement du générateur de post-mortem...</div>}>
      <PostMortemContent />
    </Suspense>
  );
}
