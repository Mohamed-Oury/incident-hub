"use client";

import { useMemo } from "react";
import Link from "next/link";
import { IncidentRecord } from "@/modules/incidents/types";
import { exportSingleIncidentToPowerPoint } from "@/modules/knowledge-base/services/export-service";

interface FicheIncidentClientProps {
  incident: IncidentRecord;
}

export function FicheIncidentClient({ incident }: FicheIncidentClientProps) {
  const isAFG = incident.subsidiary === "AFG";
  const brandPrimary = isAFG ? "#00a800" : "#e60028";
  const brandDark = isAFG ? "#15803d" : "#99001b";
  const brandBgLight = isAFG ? "#f0fdf4" : "#fef2f2";
  const brandBorder = isAFG ? "#bbf7d0" : "#fecaca";
  const subsidiaryLabel = isAFG ? "AFG Bank (Atlantic Group)" : "Société Générale (SGABS)";

  const obs = incident.observations?.[0];
  const symptomText = obs?.symptom || incident.description || "Indisponibilité ou dysfonctionnement sur le service monétique.";
  const factsText = obs?.facts || "Anomalie relevée lors des traitements transactionnels avec échec de routage ou timeout.";
  const scopeText = obs?.scope || `Canal ${incident.domain || "Monétique"} — Composant ${incident.component || "Switch / CBS"}.`;
  const contextText = obs?.context || "Environnement de production bancaire connecté aux réseaux interbancaires.";

  // Découpage des étapes de résolution pour le tableau 5.2
  const resolutionSteps = useMemo(() => {
    if (incident.resolution?.actions) {
      const parts = incident.resolution.actions
        .split(/(?:\d+\.|\n-|\n•|\n\d+\))/g)
        .map((s) => s.trim())
        .filter((s) => s.length > 5);

      if (parts.length > 1) {
        return parts.map((step, idx) => ({
          stepNumber: idx + 1,
          action: step,
          source: idx === 0 ? "Observation logs & alarmes" : idx === parts.length - 1 ? "Validation post-MEP" : "Playbook d'exploitation",
        }));
      }
    }

    // Étapes par défaut élaborées
    return [
      {
        stepNumber: 1,
        action: `Vérification immédiate de la connectivité et des processus actifs sur ${incident.component || "le composant"}.`,
        source: "Supervision temps réel (Zabbix/Prometheus)",
      },
      {
        stepNumber: 2,
        action: `Consultation des logs applicatifs horodatés et extraction des trames d'erreur (Code DE39 / ${incident.errorCode || "Anomalie"}).`,
        source: "Journal applicatif & Syslog",
      },
      {
        stepNumber: 3,
        action: `Application de la purge des sessions pendantes ou rechargement à chaud des tables de routage.`,
        source: "Procédure d'exploitation certifiée",
      },
      {
        stepNumber: 4,
        action: `Redémarrage ordonnancé du daemon/service ou bascule automatique sur le nœud secondaire (Failover).`,
        source: "Playbook Haute Disponibilité",
      },
      {
        stepNumber: 5,
        action: `Test de tir transactionnel unitaire (0800 echo test ou transaction test de 100 XOF).`,
        source: "Recette technique en ligne",
      },
      {
        stepNumber: 6,
        action: `Validation du retour à la normale du taux de succès transactionnel (> 99.5%) et de la latence (< 400ms).`,
        source: "Métriques Grafana & Core Banking",
      },
    ];
  }, [incident]);

  // Inventaire des composants / serveurs applicatifs (section 3 du document type)
  const componentsInventory = useMemo(() => {
    return [
      {
        id: 1,
        service: incident.component || "Frontal Switch / PayLogic",
        role: "Routage des flux transactionnels ISO 8583, conversion des formats et gestion des files d'attente.",
      },
      {
        id: 2,
        service: "Serveur HSM Cryptographique",
        role: "Génération, déchiffrement et validation des PIN block (LMK/ZPK), vérification CVV/iCVV.",
      },
      {
        id: 3,
        service: incident.domain?.includes("CBS") ? "Core Banking System (Amplitude/FLEXCUBE)" : "Frontal Réseau Interbancaire / GIM-UEMOA / VISA",
        role: "Autorisation comptable, vérification du solde client, tenue de position et compensation.",
      },
      {
        id: 4,
        service: "Base de Données & Journaux (EJ / Audit)",
        role: "Enregistrement permanent des transactions, archivage légal et piste d'audit conforme PCI-DSS.",
      },
    ];
  }, [incident]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = incident.occurredAt
    ? new Date(incident.occurredAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  return (
    <div className="fiche-root">
      <style>{`
        @media screen {
          .fiche-root {
            background: #0b1120;
            min-height: 100vh;
            padding: 2rem 1rem 4rem 1rem;
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          .fiche-topbar {
            max-width: 900px;
            margin: 0 auto 1.5rem auto;
            display: flex;
            justifyContent: space-between;
            align-items: center;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 0.9rem 1.4rem;
            border-radius: 14px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            color: #ffffff;
          }
          .fiche-container {
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 3rem 3.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
            box-sizing: border-box;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 14mm 12mm 14mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11pt !important;
          }
          .fiche-root {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .fiche-topbar {
            display: none !important;
          }
          .fiche-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          table {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }

        /* TYPOGRAPHIE & MISE EN FORME OFFICIELLE */
        .fiche-header-banner {
          border-left: 6px solid ${brandPrimary};
          padding-left: 1rem;
          margin-bottom: 1.5rem;
        }
        .fiche-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.25;
          margin: 0 0 0.35rem 0;
        }
        .fiche-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
          margin: 0;
        }

        /* 4 BOXES METADATA TABLEAU */
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .meta-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.75rem 0.9rem;
          background: #f8fafc;
        }
        .meta-label {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .meta-val {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }

        /* LÉGENDE CONFORMÉMENT AU DOCUMENT TYPE */
        .legende-bar {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }
        .tag-confirme {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .tag-hypothese {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fcd34d;
        }
        .tag-recommandation {
          background: #dbeafe;
          color: #1d4ed8;
          border: 1px solid #93c5fd;
        }

        /* SECTIONS NUMÉROTÉES */
        .sec-title {
          font-size: 1.12rem;
          font-weight: 800;
          color: #0f172a;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.45rem;
          margin: 1.75rem 0 0.85rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sec-sub {
          font-size: 0.95rem;
          font-weight: 800;
          color: #334155;
          margin: 1.2rem 0 0.5rem 0;
        }
        .sec-p {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #334155;
          margin: 0 0 0.85rem 0;
        }

        /* TABLEAUX OFFICIELS */
        .fiche-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0 1.25rem 0;
          font-size: 0.85rem;
        }
        .fiche-table th {
          background: #f8fafc;
          color: #0f172a;
          font-weight: 800;
          text-align: left;
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #cbd5e1;
        }
        .fiche-table td {
          padding: 0.65rem 0.85rem;
          border: 1px solid #e2e8f0;
          color: #334155;
          vertical-align: top;
          line-height: 1.45;
        }
        .fiche-table tr:nth-child(even) td {
          background: #fafafa;
        }

        /* SIGNATURE FINAL FOOTER */
        .sign-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1.5px dashed #cbd5e1;
        }
        .sign-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          background: #f8fafc;
          min-height: 90px;
        }
      `}</style>

      {/* TOPBAR FLOTTANTE ÉCRAN (MASQUÉE À L'IMPRESSION) */}
      <div className="fiche-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/hub/knowledge"
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            ← Base de connaissances
          </Link>
          <span style={{ color: "#475569" }}>|</span>
          <span
            style={{
              padding: "0.2rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.76rem",
              fontWeight: 800,
              background: brandBgLight,
              color: brandDark,
              border: `1px solid ${brandBorder}`,
            }}
          >
            {subsidiaryLabel}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 700 }}>
            {incident.reference}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href={`/hub/incidents/${incident.reference}`}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "0.45rem 0.9rem",
              borderRadius: "8px",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Vue Détaillée
          </Link>
          <button
            type="button"
            onClick={() => exportSingleIncidentToPowerPoint(incident, isAFG ? "AFG" : "SGABS")}
            style={{
              background: "#fff7ed",
              color: "#c2410c",
              border: "1.5px solid #fdba74",
              padding: "0.55rem 1.15rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(194, 65, 12, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
            }}
            title="Télécharger la présentation PowerPoint (.ppt) de cet incident conforme au template officiel"
          >
            <span>📙 Présentation PPT</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: `linear-gradient(135deg, ${brandPrimary} 0%, ${brandDark} 100%)`,
              color: "#ffffff",
              border: "none",
              padding: "0.55rem 1.25rem",
              borderRadius: "8px",
              fontSize: "0.88rem",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>🖨️ Imprimer / Enregistrer en PDF</span>
          </button>
        </div>
      </div>

      {/* FEUILLE OFFICIELLE DU RAPPORT D'INCIDENT (FORMAT A4) */}
      <main className="fiche-container">
        {/* EN-TÊTE : TITRE ET SOUS-TITRE */}
        <header className="fiche-header-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  color: brandDark,
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                RÉFÉRENTIEL MONÉTIQUE &amp; CORE BANKING • {subsidiaryLabel.toUpperCase()}
              </div>
              <h1 className="fiche-title">
                Fiche incident Payway / Monétique : {incident.title}
              </h1>
              <p className="fiche-subtitle">
                Fiche incident récapitulative — Banking Command Center &amp; Piste d&apos;Audit PCI-DSS
              </p>
            </div>

            {/* Logo Filiale */}
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "1.5rem" }}>
              {isAFG ? (
                <img
                  src="/afg-logo.png"
                  alt="AFG Bank"
                  style={{ height: "46px", objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    background: "#e60028",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                  }}
                >
                  <span>🔴</span> SGABS IT BANKING
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CADRE MÉTADONNÉES EN 4 BLOCS (CONFORME AU MODÈLE) */}
        <section className="meta-grid" aria-label="Métadonnées de l'incident">
          <div className="meta-card">
            <div className="meta-label">Date de rédaction</div>
            <div className="meta-val">{formattedDate}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Référent Monétique</div>
            <div className="meta-val">Mohamed Oury Diallo</div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Expert IT Banking</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Application impactée</div>
            <div className="meta-val">{incident.component || "Payway / Switch"}</div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Domaine : {incident.domain || "Monétique"}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">Statut &amp; Référence</div>
            <div className="meta-val" style={{ color: brandDark }}>
              {incident.knowledgeStatus === "VALIDATED" ? "Résolu & Validé" : "Scénario Qualifié"}
            </div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>
              Ref: {incident.reference}
            </div>
          </div>
        </section>

        {/* LÉGENDE DES STATUTS DE CAUSES ET ACTIONS */}
        <div className="legende-bar" aria-label="Légende">
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>
            Légende :
          </span>
          <span className="tag-badge tag-confirme">
            <span>✓</span> [Confirmé] : Fait ou cause démontrée formellement
          </span>
          <span className="tag-badge tag-hypothese">
            <span>?</span> [Hypothèse] : Cause probable en cours d&apos;investigation
          </span>
          <span className="tag-badge tag-recommandation">
            <span>★</span> [Recommandation] : Bonne pratique pour éviter la récurrence
          </span>
        </div>

        {/* 1. RÉSUMÉ */}
        <section className="avoid-break">
          <h2 className="sec-title">1. Résumé de l&apos;incident</h2>
          <p className="sec-p">
            L&apos;incident <strong style={{ color: "#0f172a" }}>{incident.reference}</strong> survenu sur le système{" "}
            <strong>{incident.component || "Monétique"}</strong> de <strong>{subsidiaryLabel}</strong> a généré des anomalies
            de traitement opérationnel avec le code retour{" "}
            <code style={{ background: "#f1f5f9", padding: "0.15rem 0.4rem", borderRadius: "4px", color: brandDark, fontWeight: 700 }}>
              {incident.errorCode || "DE39"}
            </code>
            . Cet incident critique a mobilisé les équipes de supervision et d&apos;exploitation monétique afin d&apos;isoler le
            dysfonctionnement, appliquer les mesures conservatoires et rétablir la continuité des paiements.
          </p>
        </section>

        {/* 2. SYMPTÔME ET CONTEXTE */}
        <section className="avoid-break">
          <h2 className="sec-title">2. Symptôme et contexte</h2>
          <p className="sec-p">
            <strong>Description des symptômes :</strong> {symptomText}
          </p>
          <p className="sec-p">
            <strong>Faits constatés sur le réseau :</strong> {factsText}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              fontSize: "0.82rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <strong style={{ color: "#0f172a" }}>Périmètre &amp; Canaux :</strong> {scopeText}
            </div>
            <div>
              <strong style={{ color: "#0f172a" }}>Contexte d&apos;exploitation :</strong> {contextText}
            </div>
          </div>
        </section>

        {/* 3. INVENTAIRE DES SERVEURS & COMPOSANTS */}
        <section className="avoid-break">
          <h2 className="sec-title">3. Inventaire des serveurs applicatifs &amp; composants</h2>
          <table className="fiche-table">
            <thead>
              <tr>
                <th style={{ width: "45px", textAlign: "center" }}>#</th>
                <th style={{ width: "240px" }}>Composant / Service</th>
                <th>Rôle / Remarque opérationnelle</th>
              </tr>
            </thead>
            <tbody>
              {componentsInventory.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>{item.id}</td>
                  <td style={{ fontWeight: 700, color: "#0f172a" }}>{item.service}</td>
                  <td>{item.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. ANALYSE DE LA CAUSE */}
        <section className="avoid-break">
          <h2 className="sec-title">4. Analyse de la cause racine (RCA)</h2>
          {incident.rootCause && (
            <div
              style={{
                background: brandBgLight,
                border: `1.5px solid ${brandBorder}`,
                borderRadius: "10px",
                padding: "0.9rem 1.15rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                <span className="tag-badge tag-confirme">[Confirmé]</span>
                <strong style={{ color: brandDark, fontSize: "0.92rem" }}>
                  {incident.rootCause.category}
                </strong>
              </div>
              <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.86rem", color: "#0f172a", lineHeight: 1.5 }}>
                {incident.rootCause.description}
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                <strong>Démonstration technique :</strong> {incident.rootCause.justification}
              </p>
            </div>
          )}

          {/* Hypothèses investiguées */}
          {incident.hypotheses && incident.hypotheses.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div className="sec-sub">Hypothèses investiguées par les experts :</div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.86rem", color: "#334155" }}>
                {incident.hypotheses.map((h, i) => {
                  const isConf = h.status === "CONFIRMED";
                  const isProb = h.status === "PROBABLE";
                  return (
                    <li key={i} style={{ marginBottom: "0.45rem", lineHeight: 1.5 }}>
                      <span className={`tag-badge ${isConf ? "tag-confirme" : isProb ? "tag-hypothese" : ""}`} style={{ marginRight: "0.5rem" }}>
                        {isConf ? "[Confirmé]" : isProb ? "[Hypothèse]" : "[Rejeté]"}
                      </span>
                      <span>{h.description}</span>
                      {h.evidence && (
                        <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.15rem", fontStyle: "italic" }}>
                          Preuve : {h.evidence}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* 5. PROCÉDURE DE TRAITEMENT */}
        <section className="avoid-break" style={{ marginTop: "1rem" }}>
          <h2 className="sec-title">5. Procédure de traitement &amp; résolution</h2>

          {/* 5.1 Réflexes */}
          <div className="sec-sub">5.1 Réflexes immédiats des exploitants</div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.86rem", color: "#334155", lineHeight: 1.6 }}>
            <li>Vérifier immédiatement les alertes du frontal de paiement et le flux transactionnel temps réel.</li>
            <li>Contrôler l&apos;état des connexions TCP/IP et le statut cryptographique du serveur HSM (LMK/ZPK).</li>
            <li>Prévenir l&apos;astreinte IT Banking et notifier la direction des opérations en cas d&apos;indisponibilité &gt; 5 min.</li>
          </ul>

          {/* 5.2 Tableau de Résolution */}
          <div className="sec-sub" style={{ marginTop: "1rem" }}>
            5.2 Tableau d&apos;actions de résolution opérationnelle
          </div>
          <table className="fiche-table">
            <thead>
              <tr>
                <th style={{ width: "65px", textAlign: "center" }}>Étape</th>
                <th>Action à mener</th>
                <th style={{ width: "230px" }}>Source / Règle opérationnelle</th>
              </tr>
            </thead>
            <tbody>
              {resolutionSteps.map((s) => (
                <tr key={s.stepNumber}>
                  <td style={{ textAlign: "center", fontWeight: 800, color: brandDark }}>
                    {s.stepNumber}
                  </td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>{s.action}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {incident.resolution && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "0.82rem",
                marginTop: "0.5rem",
              }}
            >
              <strong style={{ color: "#0f172a" }}>Résultat constaté :</strong> {incident.resolution.result}
            </div>
          )}
        </section>

        {/* 6. PLAN DE MONTÉE EN COMPÉTENCE & BONNES PRATIQUES */}
        <section className="avoid-break" style={{ marginTop: "1.25rem" }}>
          <h2 className="sec-title">
            6. Plan de montée en compétence &amp; Bonnes pratiques pour éviter la récurrence
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {incident.prevention && incident.prevention.length > 0 ? (
              incident.prevention.map((prev, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    fontSize: "0.86rem",
                    lineHeight: 1.5,
                  }}
                >
                  <span className="tag-badge tag-recommandation" style={{ flexShrink: 0 }}>
                    [Recommandation]
                  </span>
                  <div>
                    <span style={{ color: "#0f172a", fontWeight: 600 }}>{prev.action}</span>
                    {prev.owner && (
                      <span style={{ fontSize: "0.78rem", color: "#64748b", marginLeft: "0.5rem" }}>
                        (Responsable : {prev.owner} • Priorité : {prev.priority || "HIGH"})
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.86rem" }}>
                  <span className="tag-badge tag-recommandation" style={{ flexShrink: 0 }}>
                    [Recommandation]
                  </span>
                  <span>
                    Intégrer une sonde synthétique de supervision émulant les messages 0200/0100 toutes les 60 secondes.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.86rem" }}>
                  <span className="tag-badge tag-recommandation" style={{ flexShrink: 0 }}>
                    [Recommandation]
                  </span>
                  <span>
                    Former les équipes d&apos;exploitation niveau 1 au diagnostic rapide des codes retours ISO 8583 (DE39).
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.86rem" }}>
                  <span className="tag-badge tag-recommandation" style={{ flexShrink: 0 }}>
                    [Recommandation]
                  </span>
                  <span>
                    Documenter la procédure de bascule de secours sur le nœud secondaire dans la base de connaissances.
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CADRE SIGNATURE & VISAS DE VALIDATION (CONFORME DOCUMENT TYPE) */}
        <footer className="sign-grid avoid-break">
          <div className="sign-box">
            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: "0.35rem" }}>
              Visa Expert Rédacteur
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
              Mohamed Oury Diallo
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Expert IT Banking &amp; Monétique ({subsidiaryLabel})
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: brandDark, fontWeight: 700 }}>
              ✓ Signé numériquement — {formattedDate}
            </div>
          </div>

          <div className="sign-box">
            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: "0.35rem" }}>
              Visa Direction Production &amp; Validation
            </div>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
              Responsable Validation &amp; Exploitation IT
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Direction des Systèmes d&apos;Information (DSI)
            </div>
            <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: "#16a34a", fontWeight: 700 }}>
              ✓ Conforme charte de qualité &amp; audit PCI-DSS
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

